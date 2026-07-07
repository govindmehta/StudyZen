export function buildExplanationFallback(subtopic) {
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

export function buildQuizFallback(topic) {
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

export function buildFlashcardFallback(topic) {
  return {
    title: `${topic} Flashcards`,
    cards: Array.from({ length: 5 }, (_, index) => ({
      question: `${topic} card ${index + 1}?`,
      answer: `Answer ${index + 1} for ${topic}.`,
    })),
  };
}

export function buildScheduleFallback(topic) {
  return {
    title: `${topic} Study Plan`,
    subtopics: [
      `Introduction to ${topic}`,
      `Core concepts of ${topic}`,
      `Hands-on practice with ${topic}`,
      `Common mistakes in ${topic}`,
      `Revision and recap of ${topic}`,
    ],
    time_allocation: ["30 minutes", "45 minutes", "45 minutes", "30 minutes", "30 minutes"],
    resources: [
      `Read a beginner guide on ${topic}.`,
      `Watch a short tutorial covering the core ideas of ${topic}.`,
      `Practice a small exercise or example for ${topic}.`,
      `Review the most common errors and pitfalls in ${topic}.`,
      `Summarize the key points and test yourself on ${topic}.`,
    ],
  };
}