import { Router } from "express";
import {
  generateFlashcards,
  generateQuiz,
  chatStudyAssistant,
  getExplanation,
  getVideos,
  listFlashcards,
  listQuizzes,
  saveStudyResponse,
} from "../controllers/study.controller.js";

export const studyRouter = Router();

studyRouter.post(["/explaination", "/explanation"], getExplanation);
studyRouter.post("/save", saveStudyResponse);
studyRouter.post("/generate-quiz", generateQuiz);
studyRouter.get("/quizzes", listQuizzes);
studyRouter.post("/generate-flashcards", generateFlashcards);
studyRouter.get("/flashcards", listFlashcards);
studyRouter.post("/videos", getVideos);
studyRouter.post("/chat", chatStudyAssistant);