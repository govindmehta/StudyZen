import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();



app.use(cors());
app.use(bodyParser.json());


app.post("/save", async (req, res) => {
  try {
    const { subtopic, title, content, examples, analogy, codeExample, keywords, summary,userId } = req.body;
    const savedResponse = await prisma.studyResponse.create({
      data: { subtopic, title, content, examples, analogy, codeExample, keywords, summary },
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
//Generating Quiz for studyZen
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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXhLlkUjr95LY4t-82QhB8fszgIUzhN-Q",
      { prompt }
    );

    const quizData = JSON.parse(response.data.content);
    const quizId = Date.now().toString(); // Unique ID for now

    // ✅ Store quiz & questions in database
    const createdQuiz = await prisma.quiz.create({
      data: {
        id: quizId,
        title: quizData.title,
        description: quizData.description,
        userId: userId,
        time: 20,
        completed: false,
        progress: 0,
        thumbnail: "default-thumbnail.png",
        questions: {
          create: quizData.questions.map((q) => ({
            question: q.question,
            options: q.options,
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

app.listen(5000, () => console.log("Server running on port 5000"));
