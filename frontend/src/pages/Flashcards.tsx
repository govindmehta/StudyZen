
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookText, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Check,
  X,
  Loader2
} from 'lucide-react';

const FlashcardStudy = ({ currentSet, onBack }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  if (!currentSet || !currentSet.cards || currentSet.cards.length === 0) return null;
  
  const currentCard = currentSet.cards[currentCardIndex];
  
  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < currentSet.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      }
    }, 200);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    }, 200);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="flex justify-between w-full max-w-2xl mb-6 items-center">
        <Button variant="ghost" onClick={onBack}>Back to Sets</Button>
        <div className="text-xl font-medium">{currentSet.title}</div>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>
      
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
        <Button variant="outline" size="icon" onClick={prevCard} disabled={currentCardIndex === 0}>
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
        
        <Button variant="outline" size="icon" onClick={nextCard} disabled={currentCardIndex === currentSet.cards.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Flashcards = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [activeSet, setActiveSet] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/flashcards?userId=${user.id}`);
      setFlashcardSets(res.data);
    } catch (error) {
      console.error("Failed to fetch flashcards", error);
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    try {
      setGenerating(true);
      await axios.post("http://localhost:5000/generate-flashcards", {
        topic,
        userId: user.id
      });
      setTopic("");
      fetchFlashcards();
      setActiveTab("all");
    } catch (error) {
      console.error("Failed to generate flashcards", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleStudy = (set) => {
    setActiveSet(set);
    setActiveTab("study");
  };

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
            <Input
              type="text"
              placeholder="Enter a topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-[200px] md:w-[260px]"
            />
          </div>
          <Button onClick={generateFlashcards} disabled={generating || !topic.trim()}>
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Create Set
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All Sets</TabsTrigger>
          <TabsTrigger value="study" disabled={!activeSet}>Study</TabsTrigger>
        </TabsList>
        
        {activeTab === "study" && activeSet && (
          <TabsContent value="study" className="mt-6">
            <FlashcardStudy currentSet={activeSet} onBack={() => {
              setActiveTab("all");
              setActiveSet(null);
            }} />
          </TabsContent>
        )}
        
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : flashcardSets.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No flashcard sets available. Generate one to start!</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flashcardSets.map((set) => (
                <Card key={set.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-primary/5 p-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <BookText className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium truncate max-w-[150px]" title={set.title}>{set.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{set.cards?.length || 0} cards</span>
                    </div>
                    <div className="h-1 bg-muted w-full rounded-full">
                      <div 
                        className="h-1 bg-primary rounded-full" 
                        style={{ width: `${set.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Last studied: {new Date(set.lastStudied).toLocaleDateString()}
                    </div>
                    <Button className="w-full" onClick={() => handleStudy(set)}>Study Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;
