import { createApp } from "./src/app.js";
import { config } from "./src/config/env.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`StudyZen JS backend running on port ${config.port}`);
});