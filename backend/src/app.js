import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { studyRouter } from "./routes/study.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.use(healthRouter);
  app.use(studyRouter);

  app.use(errorHandler);

  return app;
}