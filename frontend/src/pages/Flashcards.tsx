
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookText, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Check,
  X
} from 'lucide-react';

// Sample flashcard data
const flashcardSets = [
  {
    id: 1,
    title: "Computer Science Fundamentals",
    cards: [
      { id: 1, question: "What is a binary search?", answer: "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half." },
      { id: 2, question: "What is Object-Oriented Programming?", answer: "A programming paradigm based on the concept of 'objects', which can contain data and code: data in the form of fields, and code in the form of procedures." },
      { id: 3, question: "What is a data structure?", answer: "A data organization, management, and storage format that enables efficient access and modification." },
    ],
    lastStudied: "2 days ago",
    progress: 65,
  },
  {
    id: 2,
    title: "Calculus Formulas",
    cards: [
      { id: 1, question: "What is the derivative of sin(x)?", answer: "cos(x)" },
      { id: 2, question: "What is the integral of 1/x?", answer: "ln|x| + C" },
      { id: 3, question: "State the chain rule", answer: "If y = f(u) and u = g(x), then dy/dx = (dy/du) * (du/dx)" },
    ],
    lastStudied: "1 week ago",
    progress: 40,
  },
  {
    id: 3,
    title: "Physics Concepts",
    cards: [
      { id: 1, question: "What is Newton's First Law?", answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force." },
      { id: 2, question: "What is the formula for kinetic energy?", answer: "KE = (1/2)mv²" },
      { id: 3, question: "What is the speed of light in vacuum?", answer: "299,792,458 meters per second (approximately 3 × 10⁸ m/s)" },
    ],
    lastStudied: "3 days ago",
    progress: 75,
  },
];

const FlashcardStudy = () => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const currentSet = flashcardSets[currentSetIndex];
  const currentCard = currentSet.cards[currentCardIndex];
  
  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < currentSet.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (currentSetIndex < flashcardSets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentCardIndex(0);
      }
    }, 200);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      } else if (currentSetIndex > 0) {
        setCurrentSetIndex(currentSetIndex - 1);
        setCurrentCardIndex(flashcardSets[currentSetIndex - 1].cards.length - 1);
      }
    }, 200);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="text-xl font-medium mb-6">{currentSet.title}</div>
      
      <div 
        className="perspective w-full max-w-2xl h-64 mb-6 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full preserve-3d transition-all duration-500 ${isFlipped ? 'animate-flip' : 'animate-flip-back'}`}>
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden">
            <Card className="w-full h-full flex items-center justify-center p-6 border-2 border-primary/20">
              <div className="text-xl text-center">{currentCard.question}</div>
            </Card>
          </div>
          
          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden transform rotateY-180" style={{ transform: 'rotateY(180deg)' }}>
            <Card className="w-full h-full flex items-center justify-center p-6 bg-accent/10 border-2 border-primary/20">
              <div className="text-xl text-center">{currentCard.answer}</div>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-6">
        Click card to flip • {currentCardIndex + 1} of {currentSet.cards.length}
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" size="icon" onClick={prevCard} disabled={currentSetIndex === 0 && currentCardIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-red-100 hover:bg-red-200 text-red-600"
            onClick={nextCard}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-green-100 hover:bg-green-200 text-green-600"
            onClick={nextCard}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="icon" onClick={nextCard} disabled={currentSetIndex === flashcardSets.length - 1 && currentCardIndex === currentSet.cards.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Flashcards = () => {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-muted-foreground">
            Review and create flashcards for your study sessions.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search flashcards..."
              className="pl-8 w-[200px] md:w-[260px]"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Set
          </Button>
        </div>
      </div>

      <Tabs defaultValue="study">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="all">All Sets</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study" className="mt-6">
          <FlashcardStudy />
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flashcardSets.map((set) => (
              <Card key={set.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-primary/5 p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <BookText className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{set.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{set.cards.length} cards</span>
                  </div>
                  <div className="h-1 bg-muted w-full rounded-full">
                    <div 
                      className="h-1 bg-primary rounded-full" 
                      style={{ width: `${set.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Last studied: {set.lastStudied}
                  </div>
                  <Button className="w-full">Study Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-primary/5 p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <BookText className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">Computer Science Fundamentals</span>
                  </div>
                  <span className="text-xs text-muted-foreground">3 cards</span>
                </div>
                <div className="h-1 bg-muted w-full rounded-full">
                  <div 
                    className="h-1 bg-primary rounded-full" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Last studied: 2 days ago
                </div>
                <Button className="w-full">Study Now</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;
