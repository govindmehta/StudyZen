import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const apiKey = process.env.GEMINI_API_KEY;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "study-data.json");

const emptyStore = {
  responses: [],
  quizzes: [],
  flashcards: [],
};

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: modelName }) : null;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((item) => item.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function extractJson(text) {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

async function readStore() {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);

    return {
      responses: Array.isArray(parsed.responses) ? parsed.responses : [],
      quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
      flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : [],
    };
  } catch (error) {
    return { ...emptyStore };
  }
}

async function writeStore(store) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

async function generateJson(prompt, fallback) {
  if (!model) {
    return fallback;
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = extractJson(text);

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini generation failed:", error.message);
    return fallback;
  }
}

function buildExplanationFallback(subtopic) {
  return {
    title: `${subtopic} Overview`,
    content: `A concise explanation of ${subtopic} is not available yet.`,
    examples: `- Example 1 for ${subtopic}\n- Example 2 for ${subtopic}`,
    analogy: `Think of ${subtopic} as a practical system that helps connect ideas together.`,
    code_example: "",
    keywords: [subtopic],
    summary: `Summary for ${subtopic}.`,
  };
}

function buildQuizFallback(topic) {
  return {
    title: `${topic} Quiz`,
    description: `A short quiz about ${topic}.`,
    questions: Array.from({ length: 5 }, (_, index) => ({
      question: `${topic} question ${index + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: `Option A is the best placeholder answer for ${topic}.`,
      questionType: "MCQ",
      difficulty: index < 2 ? "Easy" : index < 4 ? "Medium" : "Hard",
    })),
  };
}

function buildFlashcardFallback(topic) {
  return {
    title: `${topic} Flashcards`,
    cards: Array.from({ length: 5 }, (_, index) => ({
      question: `${topic} card ${index + 1}?`,
      answer: `Answer ${index + 1} for ${topic}.`,
    })),
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(["/explaination", "/explanation"], async (req, res) => {
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
  const data = await generateJson(prompt, fallback);

  res.json({
    title: normalizeText(data.title) || fallback.title,
    content: normalizeText(data.content) || fallback.content,
    examples: normalizeText(data.examples) || fallback.examples,
    analogy: normalizeText(data.analogy) || fallback.analogy,
    code_example: normalizeText(data.code_example || data.codeExample) || fallback.code_example,
    keywords: toArray(data.keywords),
    summary: normalizeText(data.summary) || fallback.summary,
  });
});

app.post("/save", async (req, res) => {
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
    console.error("Failed to save response:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.post("/generate-quiz", async (req, res) => {
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
  const data = await generateJson(prompt, fallback);
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
});

app.get("/quizzes", async (req, res) => {
  const userId = normalizeText(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: "UserId is required" });
  }

  const store = await readStore();
  const quizzes = store.quizzes.filter((quiz) => quiz.userId === userId);
  res.json(quizzes);
});

app.post("/generate-flashcards", async (req, res) => {
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
  const data = await generateJson(prompt, fallback);
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
});

app.get("/flashcards", async (req, res) => {
  const userId = normalizeText(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: "UserId is required" });
  }

  const store = await readStore();
  const flashcards = store.flashcards.filter((set) => set.userId === userId);
  res.json(flashcards);
});

app.post("/videos", async (req, res) => {
  const topic = normalizeText(req.body?.topic || req.query.topic);

  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  if (!youtubeApiKey) {
    return res.json({
      video_links: [
        `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
      ],
    });
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", topic);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "5");
    url.searchParams.set("key", youtubeApiKey);

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
    console.error("Failed to fetch videos:", error);
    res.status(500).json({ error: "Failed to fetch video links" });
  }
});

app.listen(port, () => {
  console.log(`StudyZen JS backend running on port ${port}`);
});