import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const app = express();
const prisma = new PrismaClient();



app.use(cors());
app.use(bodyParser.json());


app.post("/save", async (req, res) => {
  try {
    const { subtopic, title, content, examples, analogy, codeExample, keywords, summary, userId } = req.body;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { userId } });
      if (!user) {
        user = await prisma.user.create({
          data: { userId, username: userId }
        });
      }
    }

    const savedResponse = await prisma.studyResponse.upsert({
      where: { subtopic },
      update: { title, content, examples, analogy, codeExample, keywords: JSON.stringify(keywords || []), summary, userId: user ? user.id : null },
      create: { subtopic, title, content, examples, analogy, codeExample, keywords: JSON.stringify(keywords || []), summary, userId: user ? user.id : null },
    });

    res.status(201).json(savedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.post("/generate-quiz", async (req, res) => {
  const { topic, userId } = req.body;

  if (!topic || !userId) {
    return res.status(400).json({ error: "Topic and userId are required" });
  }

  const prompt = `Generate a quiz with the following structure:
  - Topic: ${topic}
  - Number of Questions: 5
  - Format: JSON
  - Each question should have:
    - A question text
    - Four multiple-choice options
    - The correct answer
    - A brief explanation of the correct answer
    - A difficulty level: Easy, Medium, or Hard
    - Question type: "MCQ"
  Return only valid JSON with this structure:
  {
    "title": "Generated Quiz Title",
    "description": "Short quiz description",
    "questions": [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "explanation": "Explanation for why Option A is correct.",
        "questionType": "MCQ",
        "difficulty": "Medium"
      }
    ]
  }`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const quizData = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
    const quizId = Date.now().toString(); // Unique ID for now

    // Ensure the user exists or create a dummy one for now if testing without clerk sync
    let user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      user = await prisma.user.create({
        data: { userId, username: userId }
      });
    }

    // ✅ Store quiz & questions in database
      const createdQuiz = await prisma.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description,
          userId: user.id,
          time: 20,
          completed: false,
          progress: 0,
          thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
          questions: {
            create: quizData.questions.map((q) => ({
              question: q.question,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              questionType: q.questionType,
              difficulty: q.difficulty
            }))
          }
        },
        include: { questions: true }
      });

    res.json(createdQuiz);
  } catch (error) {
    console.error("Error generating or saving quiz:", error);
    res.status(500).json({ error: "Failed to generate or save quiz" });
  }
});

app.get("/quizzes", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId is required" });
  
  try {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.json([]);
    
    const quizzes = await prisma.quiz.findMany({
      where: { userId: user.id },
      include: { questions: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse options back to array
    const parsedQuizzes = quizzes.map(q => ({
      ...q,
      questions: q.questions.map(question => ({
        ...question,
        options: JSON.parse(question.options)
      }))
    }));
    
    res.json(parsedQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

app.get("/flashcards", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId is required" });
  
  try {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.json([]);
    
    const flashcards = await prisma.flashCard.findMany({
      where: { userId: user.id },
      include: { cards: true },
      orderBy: { lastStudied: 'desc' }
    });
    res.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

app.post("/generate-flashcards", async (req, res) => {
  const { topic, userId } = req.body;

  if (!topic || !userId) {
    return res.status(400).json({ error: "Topic and userId are required" });
  }

  const prompt = `Generate a set of flashcards for the topic: ${topic}.
  Generate 5 flashcards.
  Format: JSON
  Return only valid JSON with this structure:
  {
    "title": "Generated Flashcard Set Title",
    "cards": [
      {
        "question": "Question text here?",
        "answer": "Answer text here."
      }
    ]
  }`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const flashcardData = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);

    let user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      user = await prisma.user.create({
        data: { userId, username: userId }
      });
    }

    const createdFlashcardSet = await prisma.flashCard.create({
      data: {
        title: flashcardData.title,
        userId: user.id,
        progress: 0,
        cards: {
          create: flashcardData.cards.map((c) => ({
            question: c.question,
            answer: c.answer
          }))
        }
      },
      include: { cards: true }
    });

    res.json(createdFlashcardSet);
  } catch (error) {
    console.error("Error generating or saving flashcards:", error);
    res.status(500).json({ error: "Failed to generate or save flashcards" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
