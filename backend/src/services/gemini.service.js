import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";
import { extractJson } from "../utils/json.js";

const genAI = config.geminiApiKey ? new GoogleGenerativeAI(config.geminiApiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: config.geminiModel }) : null;

export async function generateStudyJson(prompt, fallback) {
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

export async function generateStudyText(prompt, fallbackText) {
  if (!model) {
    return fallbackText;
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim() || fallbackText;
  } catch (error) {
    console.error("Gemini text generation failed:", error.message);
    return fallbackText;
  }
}