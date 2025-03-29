import React from 'react';
import { Link, Router, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookText, Clock } from 'lucide-react';

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 md:px-10 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-md w-8 h-8 flex items-center justify-center font-bold">
            S
          </div>
          <span className="text-xl font-bold">StudyZen</span>
        </div>
        
        <div className="flex items-center gap-3">
          {!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
            <>
              <Button variant="ghost" size="sm" onClick={()=>navigate('/sign-in')}>Sign In</Button>
              <Button onClick={()=>navigate('/sign-up')}>Sign Up</Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="container max-w-5xl px-4 py-20 md:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Study Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enhance your learning experience with personalized flashcards, quizzes, and timed study sessions.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            className="pl-10 py-6 text-lg shadow-md focus-visible:ring-primary"
            placeholder="Search for topics or concepts..."
          />
          <Button className="absolute right-1.5 top-1.5">
            <BookText className="h-5 w-5 mr-2" />
            Start Learning
          </Button>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Flashcards</h3>
            <p className="text-muted-foreground">Create and study with digital flashcards to boost your memory retention.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Smart Search</h3>
            <p className="text-muted-foreground">Find exactly what you need with our powerful search functionality.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Study Timer</h3>
            <p className="text-muted-foreground">Stay focused and track your study sessions with our customizable timer.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
