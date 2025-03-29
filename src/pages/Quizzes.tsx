
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  SquarePen, 
  LayoutDashboard, 
  Clock, 
  Plus, 
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft 
} from 'lucide-react';

// Sample quiz data
const quizzes = [
  {
    id: 1,
    title: "Computer Science Basics",
    description: "Test your knowledge of fundamental computer science concepts",
    questions: 15,
    time: 20,
    completed: true,
    score: 85,
    thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Calculus II Midterm Review",
    description: "Practice problems for the upcoming midterm exam",
    questions: 20,
    time: 30,
    completed: false,
    progress: 40,
    thumbnail: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: 3,
    title: "Physics: Mechanics",
    description: "Review of key concepts in classical mechanics",
    questions: 12,
    time: 15,
    completed: false,
    progress: 0,
    thumbnail: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: 4,
    title: "Data Structures",
    description: "Quiz on arrays, linked lists, trees, and graphs",
    questions: 18,
    time: 25,
    completed: true,
    score: 92,
    thumbnail: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
];

// Sample quiz questions
const sampleQuiz = {
  title: "Computer Science Basics",
  questions: [
    {
      id: 1,
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Process Utility",
        "Core Processing Unit"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which of the following is NOT a programming language?",
      options: [
        "Java",
        "Python",
        "HTML",
        "HTTP"
      ],
      correctAnswer: 3
    },
    {
      id: 3,
      question: "What is the time complexity of a binary search algorithm?",
      options: [
        "O(n)",
        "O(n²)",
        "O(log n)",
        "O(n log n)"
      ],
      correctAnswer: 2
    }
  ]
};

const QuizTaking = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const quiz = sampleQuiz;
  const question = quiz.questions[currentQuestion];
  
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };
  
  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };
  
  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
        <div className={`rounded-full p-4 mb-4 ${score >= 70 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {score >= 70 ? <CheckCircle2 className="h-12 w-12" /> : <AlertTriangle className="h-12 w-12" />}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-muted-foreground mb-6">Your score: {score}%</p>
        
        <div className="w-full max-w-md">
          <Progress value={score} className={score >= 70 ? '[&>div]:bg-green-500' : '[&>div]:bg-yellow-500'} />
        </div>
        
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswers([]);
            setShowResults(false);
          }}>
            Try Again
          </Button>
          <Button>Back to Quizzes</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">15:42 remaining</span>
        </div>
      </div>
      
      <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="mb-8" />
      
      <Card className="mb-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswers[currentQuestion]?.toString()} 
            onValueChange={(value) => handleSelectAnswer(parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        
        <Button 
          onClick={handleNext} 
          disabled={selectedAnswers[currentQuestion] === undefined}
        >
          {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState("available");
  
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge with interactive quizzes.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="pl-8 w-[200px] md:w-[260px]"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="available" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        {activeTab === "quiz" ? (
          <TabsContent value="quiz" className="mt-6">
            <QuizTaking />
          </TabsContent>
        ) : (
          <>
            <TabsContent value="available" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes
                  .filter(quiz => !quiz.completed && (!quiz.progress || quiz.progress === 0))
                  .map(quiz => (
                    <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`${quiz.thumbnail} h-3`}></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{quiz.title}</CardTitle>
                          <SquarePen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm mb-4">
                          <div className="flex items-center">
                            <LayoutDashboard className="h-4 w-4 mr-1" />
                            <span>{quiz.questions} questions</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{quiz.time} min</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => setActiveTab("quiz")}>Start Quiz</Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="ongoing" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes
                  .filter(quiz => !quiz.completed && quiz.progress && quiz.progress > 0)
                  .map(quiz => (
                    <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`${quiz.thumbnail} h-3`}></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{quiz.title}</CardTitle>
                          <SquarePen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{quiz.progress}%</span>
                          </div>
                          <Progress value={quiz.progress} />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => setActiveTab("quiz")}>Continue</Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes
                  .filter(quiz => quiz.completed)
                  .map(quiz => (
                    <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`${quiz.thumbnail} h-3`}></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{quiz.title}</CardTitle>
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium">{quiz.score}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm mb-4">
                          <div className="flex items-center">
                            <LayoutDashboard className="h-4 w-4 mr-1" />
                            <span>{quiz.questions} questions</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{quiz.time} min</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Results</Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Quizzes;




