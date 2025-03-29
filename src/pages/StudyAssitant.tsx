import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send, MessageCircle } from "lucide-react";

const StudyAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "That's an interesting question!" },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-4">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          className="pl-10 py-6 text-lg shadow-md focus-visible:ring-primary w-full"
          placeholder="Search for topics or concepts..."
        />
        <Button className="absolute right-1.5 top-1.5">
          <MessageCircle className="h-5 w-5 mr-2" /> Start Learning
        </Button>
      </div>

      {/* Chat Messages */}
      <Card className="w-full h-[60vh] overflow-y-auto p-4 shadow-md">
        <CardContent className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
    msg.sender === "user" ? "bg-primary text-white self-end ml-auto" : "bg-muted text-gray-900"
  }`}
            >
              {msg.text}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Input Bar */}
      <div className="relative w-full flex">
        <Input
          className="pl-4 py-4 text-lg shadow-md focus-visible:ring-primary w-full"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="ml-2">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default StudyAssistant;
