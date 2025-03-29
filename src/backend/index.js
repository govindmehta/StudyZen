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

app.listen(5000, () => console.log("Server running on port 5000"));
