import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const dataFile = path.join(dataDir, "study-data.json");

const emptyStore = {
  responses: [],
  quizzes: [],
  flashcards: [],
};

export async function readStore() {
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

export async function writeStore(store) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}