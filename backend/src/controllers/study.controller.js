import { randomUUID } from "crypto";
import { buildFlashcardFallback, buildExplanationFallback, buildQuizFallback } from "../services/fallbacks.service.js";
import { generateStudyJson, generateStudyText } from "../services/gemini.service.js";
import { readStore, writeStore } from "../services/store.service.js";
import { normalizeText, toArray } from "../utils/text.js";

export async function getExplanation(req, res, next) {
  try {
    const subtopic = normalizeText(req.body?.subtopic || req.query.subtopic);

    if (!subtopic) {
      return res.status(400).json({ error: "subtopic is required" });
    }

    const prompt = `You are helping a student learn ${subtopic}.
Return only valid JSON with this structure:
{
  "title": "Short title",
  "content": "Clear explanation in markdown",
  "examples": "Markdown list or short paragraph of examples",
  "analogy": "Simple analogy",
  "code_example": "Optional code example in markdown",
  "keywords": ["keyword1", "keyword2"],
  "summary": "Short summary"
}

Keep the answer concise, accurate, and educational.`;

    const fallback = buildExplanationFallback(subtopic);
    const data = await generateStudyJson(prompt, fallback);

    res.json({
      title: normalizeText(data.title) || fallback.title,
      content: normalizeText(data.content) || fallback.content,
      examples: normalizeText(data.examples) || fallback.examples,
      analogy: normalizeText(data.analogy) || fallback.analogy,
      code_example: normalizeText(data.code_example || data.codeExample) || fallback.code_example,
      keywords: toArray(data.keywords),
      summary: normalizeText(data.summary) || fallback.summary,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveStudyResponse(req, res, next) {
  try {
    const {
      subtopic,
      title,
      content,
      examples,
      analogy,
      codeExample,
      keywords,
      summary,
      userId,
    } = req.body || {};

    if (!normalizeText(subtopic)) {
      return res.status(400).json({ error: "subtopic is required" });
    }

    const store = await readStore();
    const record = {
      id: randomUUID(),
      subtopic: normalizeText(subtopic),
      title: normalizeText(title) || normalizeText(subtopic),
      content: normalizeText(content),
      examples: normalizeText(examples),
      analogy: normalizeText(analogy),
      codeExample: normalizeText(codeExample),
      keywords: JSON.stringify(Array.isArray(keywords) ? keywords : []),
      summary: normalizeText(summary),
      userId: normalizeText(userId),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const existingIndex = store.responses.findIndex((item) => item.subtopic === record.subtopic);

    if (existingIndex >= 0) {
      record.id = store.responses[existingIndex].id;
      record.createdAt = store.responses[existingIndex].createdAt || record.createdAt;
      store.responses[existingIndex] = record;
    } else {
      store.responses.unshift(record);
    }

    await writeStore(store);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

export async function generateQuiz(req, res, next) {
  try {
    const topic = normalizeText(req.body?.topic);
    const userId = normalizeText(req.body?.userId);

    if (!topic || !userId) {
      return res.status(400).json({ error: "Topic and userId are required" });
    }

    const prompt = `Generate a quiz about ${topic}.
Return only valid JSON with this structure:
{
  "title": "Quiz title",
  "description": "Short description",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why the answer is correct.",
      "questionType": "MCQ",
      "difficulty": "Easy"
    }
  ]
}

Create 5 multiple choice questions and keep the output valid JSON.`;

    const fallback = buildQuizFallback(topic);
    const data = await generateStudyJson(prompt, fallback);
    const store = await readStore();

    const generatedQuestions = Array.isArray(data.questions) ? data.questions : [];
    const createdQuiz = {
      id: randomUUID(),
      title: normalizeText(data.title) || fallback.title,
      description: normalizeText(data.description) || fallback.description,
      userId,
      time: 20,
      completed: false,
      score: null,
      progress: 0,
      thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
      createdAt: new Date().toISOString(),
      questions: generatedQuestions.map((question) => ({
        id: randomUUID(),
        question: normalizeText(question.question) || "Question",
        options: Array.isArray(question.options) ? question.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: normalizeText(question.correctAnswer) || "Option A",
        explanation: normalizeText(question.explanation),
        questionType: normalizeText(question.questionType) || "MCQ",
        difficulty: normalizeText(question.difficulty) || "Medium",
      })),
    };

    if (createdQuiz.questions.length === 0) {
      createdQuiz.questions = fallback.questions.map((question) => ({
        id: randomUUID(),
        ...question,
      }));
    }

    store.quizzes.unshift(createdQuiz);
    await writeStore(store);

    res.json(createdQuiz);
  } catch (error) {
    next(error);
  }
}

export async function listQuizzes(req, res, next) {
  try {
    const userId = normalizeText(req.query.userId);

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const store = await readStore();
    const quizzes = store.quizzes.filter((quiz) => quiz.userId === userId);
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
}

export async function generateFlashcards(req, res, next) {
  try {
    const topic = normalizeText(req.body?.topic);
    const userId = normalizeText(req.body?.userId);

    if (!topic || !userId) {
      return res.status(400).json({ error: "Topic and userId are required" });
    }

    const prompt = `Generate 5 flashcards about ${topic}.
Return only valid JSON with this structure:
{
  "title": "Flashcard set title",
  "cards": [
    {
      "question": "Question text?",
      "answer": "Answer text."
    }
  ]
}

Keep it concise and valid JSON.`;

    const fallback = buildFlashcardFallback(topic);
    const data = await generateStudyJson(prompt, fallback);
    const store = await readStore();

    const generatedCards = Array.isArray(data.cards) ? data.cards : [];
    const createdFlashcards = {
      id: randomUUID(),
      title: normalizeText(data.title) || fallback.title,
      userId,
      progress: 0,
      lastStudied: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      cards: generatedCards.map((card) => ({
        id: randomUUID(),
        question: normalizeText(card.question) || "Question",
        answer: normalizeText(card.answer) || "Answer",
      })),
    };

    if (createdFlashcards.cards.length === 0) {
      createdFlashcards.cards = fallback.cards.map((card) => ({
        id: randomUUID(),
        ...card,
      }));
    }

    store.flashcards.unshift(createdFlashcards);
    await writeStore(store);

    res.json(createdFlashcards);
  } catch (error) {
    next(error);
  }
}

export async function listFlashcards(req, res, next) {
  try {
    const userId = normalizeText(req.query.userId);

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const store = await readStore();
    const flashcards = store.flashcards.filter((set) => set.userId === userId);
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
}

export async function getVideos(req, res, next) {
  try {
    const topic = normalizeText(req.body?.topic || req.query.topic);

    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.json({
        video_links: [
          `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
        ],
      });
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", topic);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "5");
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

    const response = await fetch(url);
    const payload = await response.json();

    const videoLinks = Array.isArray(payload.items)
      ? payload.items
          .map((item) => item?.id?.videoId)
          .filter(Boolean)
          .map((videoId) => `https://www.youtube.com/watch?v=${videoId}`)
      : [];

    res.json({ video_links: videoLinks });
  } catch (error) {
    next(error);
  }
}

export async function chatStudyAssistant(req, res, next) {
  try {
    const message = normalizeText(req.body?.message);

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const prompt = `You are a helpful study assistant. The user is asking: "${message}"
Provide a helpful, educational response focused on learning. Keep your answer concise but informative.`;

    const response = await generateStudyText(
      prompt,
      "Sorry, I couldn't generate a response at this time."
    );

    res.json({ response });
  } catch (error) {
    next(error);
  }
}