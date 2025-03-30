import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Send,
  MessageCircle,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/Loader";

import { useUser } from "@clerk/clerk-react";

// Markdown components configuration
const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={materialLight}
        language={match[1]}
        wrapLongLines
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  // Add styling for headings
  h1: (props) => <h1 {...props} className="text-3xl font-bold my-4" />,
  h2: (props) => <h2 {...props} className="text-2xl font-bold my-3" />,
  h3: (props) => <h3 {...props} className="text-xl font-semibold my-2" />,
  h4: (props) => <h4 {...props} className="text-lg font-semibold my-2" />,
  // Style paragraphs and lists
  p: (props) => <p {...props} className="my-2 text-gray-800" />,
  ul: (props) => <ul {...props} className="list-disc pl-6 my-2" />,
  ol: (props) => <ol {...props} className="list-decimal pl-6 my-2" />,
  li: (props) => <li {...props} className="my-1" />,
};

// Chat message component
const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-3/4 rounded-lg px-4 py-2 ${
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-none"
          : "bg-muted text-muted-foreground rounded-tl-none"
      }`}
    >
      {message}
    </div>
  </div>
);

const StudyAssistant = () => {
  const { user } = useUser();
  const clerkUserId = user?.id; // Get Clerk's User ID
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      message: "Hi there! How can I help you with your studies today?",
      isUser: false,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle chat dragging
  const handleMouseDown = (e) => {
    if (chatRef.current && e.target.closest(".chat-header")) {
      setIsDragging(true);
      const chatRect = chatRef.current.getBoundingClientRect();
      setChatPosition({
        x: e.clientX - chatRect.left,
        y: e.clientY - chatRect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && chatRef.current) {
      const parentRect = chatRef.current.parentElement.getBoundingClientRect();
      const newLeft = e.clientX - chatPosition.x - parentRect.left;
      const newTop = e.clientY - chatPosition.y - parentRect.top;

      // Ensure chat stays within parent bounds
      const maxLeft = parentRect.width - chatRef.current.offsetWidth;
      const maxTop = parentRect.height - chatRef.current.offsetHeight;

      chatRef.current.style.left = `${Math.max(
        0,
        Math.min(newLeft, maxLeft)
      )}px`;
      chatRef.current.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
      chatRef.current.style.bottom = "auto";
      chatRef.current.style.right = "auto";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const [youtubeLinks, setYoutubeLinks] = useState([]);

  // Fetch YouTube links after getting the explanation data
  const fetchYoutubeLinks = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/videos/?topic=${query}`
      );
      setYoutubeLinks(response.data.video_links);
      console.log("YouTube Links:", response.data.video_links);
      console.log("Youtube Links:", youtubeLinks);
    } catch (err) {
      console.error("Failed to fetch YouTube links:", err);
    }
  };

  const fetchData = async () => {
    if (query.trim() === "") return;
    setLoading(true);
    setError("");
    setData(null); // Clear previous data

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/explaination/?subtopic=${query}`
      );

      console.log("Response:", response.data);
      setData(response.data);

      // const responseSend = await axios.post("http://localhost:5000/save", {
      //   subtopic: query,
      //   title: response.data.title || "",
      //   content: response.data.content || "",
      //   examples: response.data.examples || "",
      //   analogy: response.data.analogy || "",
      //   codeExample: response.data.code_example || "",
      //   keywords: response.data.keywords || [],
      //   summary: response.data.summary || "",
      //   userId: clerkUserId, // Send Clerk's User ID
      // });
      // Fetch YouTube links
      fetchYoutubeLinks();
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGeminiResponse = async (prompt) => {
    // Your Gemini API integration
    try {
      // Replace with your actual Gemini API endpoint and key
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXhLlkUjr95LY4t-82QhB8fszgIUzhN-Q",
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            // You would typically store this in an environment variable
            // "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY
          },
        }
      );

      return (
        response.data.candidates[0]?.content?.parts[0]?.text ||
        "I couldn't generate a response at this time."
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      return "Sorry, I encountered an error while processing your request.";
    }
  };

  const handleChatSubmit = async () => {
    if (chatInput.trim() === "") return;

    // Add user message to chat
    setChatMessages([...chatMessages, { message: chatInput, isUser: true }]);
    const userQuestion = chatInput;
    setChatInput("");
    setChatLoading(true);

    // Get response from Gemini API
    try {
      const prompt = `You are a helpful study assistant. The user is asking: "${userQuestion}"
      Provide a helpful, educational response focused on learning. Keep your answer concise but informative.`;

      const response = await fetchGeminiResponse(prompt);

      setChatMessages((prev) => [
        ...prev,
        {
          message: response,
          isUser: false,
        },
      ]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          message:
            "Sorry, I couldn't process your request at this time. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Process data content for better rendering
  const processContent = (content) => {
    if (!content) return "";

    // Replace asterisks with proper markdown list items
    let processedContent = content;

    if (content.includes("Key concepts include:")) {
      const [beforeList, afterList] = content.split("Key concepts include:");
      let listItems = afterList.split("*").filter((item) => item.trim());
      listItems = listItems.map((item) => `- ${item.trim()}`).join("\n");
      processedContent = `${beforeList}## Key concepts include:\n\n${listItems}`;
    }

    return processedContent;
  };
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  return (
    <div
      className="w-full min-h-[100vh] flex flex-col mx-auto space-y-6 p-6 bg-gray-50"
      onMouseDown={handleMouseDown}
    >
      {/* Search Bar for Query Input - Made bigger */}
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <Input
          className="pl-12 py-8 text-xl shadow-md focus-visible:ring-primary w-full bg-white rounded-xl"
          placeholder="Enter a topic to learn..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
        />
        <Button
          onClick={fetchData}
          className="absolute right-2 top-2 px-6 py-6 text-lg rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <MessageCircle className="h-5 w-5 mr-2" />
          )}
          Search
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-4xl mx-auto w-full">
          <p>{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center p-12 max-w-5xl mx-auto w-full">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-lg text-gray-600">
              Fetching your learning materials...
            </p>
          </div>
        </div>
      )}

      {/* Content Display */}
      {!loading && data && (
        <Card className="p-8 shadow-xl rounded-2xl bg-white w-full max-w-5xl mx-auto border border-gray-200">
          <CardContent className="p-0 space-y-6">
            {/* Title */}
            <h2 className="text-4xl font-bold text-gray-900 border-b-2 pb-2">
              📌 {data.title || "Understanding the Topic"}
            </h2>

            {/* Main Content Section */}
            <div className="text-lg text-gray-800 leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {processContent(data.content)}
              </ReactMarkdown>
            </div>

            {/* Key Concepts Section with Styled Subheading */}
            {data.content?.includes("Key concepts include:") && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600 shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 pb-2 border-b-2 border-gray-300">
                  🔑 Key Concepts
                </h3>
                <ul className="list-disc pl-6 space-y-3 text-lg text-gray-800 mt-4">
                  {data.content
                    .split("*")
                    .slice(1)
                    .map((point, index) => (
                      <li key={index} className="pl-2">
                        {point.trim()}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Examples Section */}
            {data.examples && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                  🔍 Examples
                </h3>
                <div className="text-lg text-gray-800 leading-relaxed mt-3">
                  <ReactMarkdown components={markdownComponents}>
                    {data.examples}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Analogy Section */}
            {data.analogy && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                  💡 Analogy
                </h3>
                <div className="bg-blue-50 p-5 rounded-lg mt-3 border-l-4 border-blue-400">
                  <ReactMarkdown components={markdownComponents}>
                    {data.analogy}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Code Example Section */}
            {data.code_example && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                  🖥️ Code Example
                </h3>
                <div className="bg-gray-100 p-4 rounded-lg mt-3">
                  <ReactMarkdown components={markdownComponents}>
                    {data.code_example}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Keywords Section */}
            {data.keywords && data.keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                  📚 Keywords
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Section */}
            {data.summary && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                  📜 Summary
                </h3>
                <div className="bg-gray-50 p-5 rounded-lg mt-3 border-l-4 border-green-500">
                  <ReactMarkdown components={markdownComponents}>
                    {data.summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* YouTube Links Section */}
      {youtubeLinks.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border-l-4 border-red-500 shadow-sm">
          <h3 className="text-3xl font-bold text-gray-900 pb-2 border-b-2 border-gray-300">
            🎥 Recommended YouTube Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-blue-700 font-semibold">
            {/* {youtubeLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
              >
              </a>
            ))} */}
            {youtubeLinks.map((link, index) => {
              const videoId = new URL(link).searchParams.get("v");
              return (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                    alt={`YouTube Video ${index + 1}`}
                    className="rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
                  />
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-90 right-8 flex gap-2">
        <button
          onClick={() => setShowWhiteboard(!showWhiteboard)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          {showWhiteboard ? "Close" : "Whiteboard"}
        </button>
      </div>

      {/* Whiteboard Section (Visible only when showWhiteboard is true) */}
      {showWhiteboard && (
        <div className="mt-6">
          <iframe
            src="https://excalidraw.com"
            width="100%"
            height="500px"
            className="mt-3 border rounded-lg shadow-sm"
          ></iframe>
        </div>
      )}
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-all"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>

      {/* Draggable Chat Panel */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 w-[600px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-gray-200"
          style={{
            position: "absolute",
            cursor: isDragging ? "grabbing" : "default",
          }}
        >
          {/* Chat Header - Made draggable */}
          <div
            className="p-4 border-b flex items-center bg-primary text-white rounded-t-lg chat-header"
            style={{ cursor: "grab" }}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Study Assistant</h3>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-2">
              {chatMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.message}
                  isUser={msg.isUser}
                />
              ))}
              {chatLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-3 border-t flex items-end gap-2">
            <Textarea
              className="resize-none"
              placeholder="Ask a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }}
              rows={2}
            />
            <Button
              size="icon"
              onClick={handleChatSubmit}
              disabled={chatLoading || chatInput.trim() === ""}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyAssistant;
