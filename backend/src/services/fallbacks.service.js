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