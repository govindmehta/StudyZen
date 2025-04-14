# StudyZen

An AI-powered study companion that helps students learn more effectively through personalized study plans, content explanations, flashcards, quizzes, and more.

![StudyZen Dashboard](https://placeholder.com/studyzen-dashboard)

## 🚀 Features

### 📝 Personalized Study Plans
- Generate custom study schedules based on your topics and learning goals
- Track your progress with intuitive dashboards and analytics

### 🧠 Smart Content Explanations
- Get detailed explanations of any study topic with examples and analogies
- Customize content depth based on your understanding level

### 📊 Interactive Flowcharts & Visualizations
- Auto-generate flowcharts for complex topics
- Visual learning aids to understand relationships between concepts

### 📚 Flashcards
- Create and review customized flashcards
- Spaced repetition system for better retention

### 📋 Smart Quizzes
- AI-generated quizzes to test your knowledge
- Adaptive difficulty based on your performance

### 🎬 Resource Recommendations
- Get relevant YouTube videos for any study topic
- Find supplementary learning materials

### 🔊 Text-to-Speech
- Convert study material to audio for on-the-go learning
- Adjust speech parameters for optimal listening experience

### ⏰ Study Timer
- Track your study sessions
- Built-in breaks following the Pomodoro technique

## 🛠️ Tech Stack

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **Prisma**: Database ORM

### Backend
- **FastAPI**: Python web framework
- **Google Gemini AI**: Large language model integration
- **LangChain**: Framework for LLM applications
- **ChromaDB**: Vector database
- **OpenCV**: Image processing for flowchart clarity detection
- **Pandas**: Data manipulation

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Git

### Installation

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload
```

## 📝 API Endpoints

### Study Content
- `POST /explaination/`: Get detailed explanations for any study topic
- `POST /generate_schedule/`: Create personalized study schedules
- `POST /flowchart/`: Generate visual flowcharts for complex topics
- `POST /videos/`: Find relevant educational videos

### User Progress
- User authentication and progress tracking through Prisma database

## 🖥️ Screenshots

![Study Plan](https://placeholder.com/study-plan)
![Flashcards](https://placeholder.com/flashcards)
![Quiz System](https://placeholder.com/quiz-system)

## 🧪 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

### Environment Variables
Create a `.env` file in both frontend and backend directories with the following:

#### Backend `.env`
```
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

#### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Google Gemini API for powering the AI features
- The Langchain community for frameworks and tools
- Shadcn UI for the beautiful component library
