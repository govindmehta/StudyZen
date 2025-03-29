import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send, MessageCircle } from "lucide-react";

const StudyAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXhLlkUjr95LY4t-82QhB8fszgIUzhN-Q`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userInput }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();

      let assistantText = "Sorry, I couldn't process that.";
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        assistantText = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        assistantText = `Response blocked: ${data.promptFeedback.blockReason}`;
      }

      const assistantMessage = { sender: "assistant", text: assistantText };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: `Error: ${error instanceof Error ? error.message : "Failed to get response"}` },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-[100vh] flex flex-col mx-auto space-y-4 p-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <Input
          className="pl-12 py-4 text-lg shadow-md focus-visible:ring-primary w-full"
          placeholder="Search for topics or concepts..."
        />
        <Button className="absolute right-2 top-2 px-6 py-3 text-lg">
          <MessageCircle className="h-6 w-6 mr-2" /> Start Learning
        </Button>
      </div>

      {/* Chat Messages */}
      <Card className="w-full flex-grow overflow-hidden shadow-lg rounded-xl">
        <CardContent className="h-full flex flex-col overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground self-end ml-auto max-w-[80%]"
                  : "bg-muted text-foreground max-w-[80%]"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="text-muted-foreground italic text-lg">Thinking...</div>}
        </CardContent>
      </Card>

      {/* Input Bar (Fixed at the bottom) */}
      <div className="relative w-full flex pb-4">
        <Input
          className="pl-6 py-4 text-lg shadow-md focus-visible:ring-primary w-full"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          disabled={loading}
        />
        <Button onClick={handleSendMessage} className="ml-3 px-6 py-4 text-lg" disabled={loading || input.trim() === ""}>
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default StudyAssistant;
