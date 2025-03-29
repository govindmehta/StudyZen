// import React, { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Search, Send, MessageCircle, MessageSquare } from "lucide-react";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// const components = {
//   code({ node, inline, className, children, ...props }) {
//     const match = /language-(\w+)/.exec(className || "");
//     return !inline && match ? (
//       <SyntaxHighlighter
//         style={materialLight}
//         language={match[1]}
//         wrapLongLines
//         {...props}
//       >
//         {String(children).replace(/\n$/, "")}
//       </SyntaxHighlighter>
//     ) : (
//       <code className={className} {...props}>
//         {children}
//       </code>
//     );
//   },
// };

// const exampleData = {
//   content:
//     "Tokenization is the process of breaking down a text into individual units called tokens. These tokens can be words, subwords, characters, or even symbols, depending on the task and the type of tokenizer used...",
//   examples:
//     '**Example 1: Word-level tokenization**\nThe sentence "I love eating pizza." can be tokenized into: ["I", "love", "eating", "pizza", "."]\n\n**Example 2: Subword tokenization**\nThe word "unfortunately" can be tokenized into: ["un", "for", "tun", "ate", "ly"]\n\n**Example 3: Character-level tokenization**\nThe word "hello" can be tokenized into: ["h", "e", "l", "l", "o"]',
//   analogies:
//     "Think of tokenization like chopping vegetables for a recipe. You start with a whole onion (the text) and chop it into smaller pieces (tokens)...",
//   code_example: `**Python using NLTK:**  
//   \`\`\`python
//   import nltk
//   from nltk.tokenize import word_tokenize
  
//   nltk.download('punkt')
//   text = "Tokenization is fun!" 
  
//   words = word_tokenize(text)
//   print("Word tokens:", words)
//   \`\`\`
  
//   **Python using spaCy:**  
//   \`\`\`python
//   import spacy
  
//   nlp = spacy.load("en_core_web_sm")
//   text = "This is another example."
  
//   doc = nlp(text)
//   for token in doc:
//       print(token.text)
//   \`\`\``,
//   keywords: ["Tokenization", "NLP", "Tokens", "Subword", "Word"],
//   summary:
//     "1. Tokenization breaks down text into smaller units (tokens).\n2. It helps computers process text for NLP tasks.\n3. Different tokenization methods exist based on the task.",
// };

// const StudyAssistant = () => {
//   const [messages, setMessages] = useState([
//     { sender: "assistant", text: "Hello! How can I assist you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;
//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXhLlkUjr95LY4t-82QhB8fszgIUzhN-Q`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: input }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch response");
//       const data = await response.json();
//       const assistantText = data.text || "Sorry, I couldn't process that.";
//       setMessages((prev) => [
//         ...prev,
//         { sender: "assistant", text: assistantText },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "assistant", text: `Error: ${error.message}` },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="w-full h-[100vh] flex flex-col mx-auto space-y-6 p-6">
//       {/* Search Bar */}
//       <div className="relative w-full">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//           <Search className="h-6 w-6 text-muted-foreground" />
//         </div>
//         <Input
//           className="pl-12 py-4 text-lg shadow-md focus-visible:ring-primary w-full max-w-2xl"
//           placeholder="Search for topics or concepts..."
//         />
//         <Button className="absolute right-2 top-2 px-6 py-3 text-lg">
//           <MessageCircle className="h-6 w-6 mr-2" /> Start Learning
//         </Button>
//       </div>

//       {/* Empty div beneath the input box */}
//       <div className="h-10"></div>

//       {/* Formatted Data Section */}
//       <Card className="p-6 shadow-lg rounded-xl bg-white">
//         <CardContent className="space-y-4">
//           <h2 className="text-4xl font-bold underline">
//             📌 Understanding Tokenization
//           </h2>
//           <p className="text-lg">{exampleData.content}</p>

//           <h3 className="text-2xl font-bold">🔍 Examples</h3>
//           <div className="text-lg">
//             <ReactMarkdown>{exampleData.examples}</ReactMarkdown>
//           </div>

//           <h3 className="text-2xl font-bold">💡 Analogy</h3>
//           <p className="text-lg">{exampleData.analogies}</p>

//           <h3 className="text-2xl font-bold">🖥️ Code Examples</h3>
//           <div className="text-lg">
//             <ReactMarkdown components={components}>
//               {exampleData.code_example}
//             </ReactMarkdown>
//           </div>

//           <h3 className="text-2xl font-bold">📚 Keywords</h3>
//           <div className="flex flex-wrap gap-2">
//             {exampleData.keywords.map((keyword, index) => (
//               <span
//                 key={index}
//                 className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg"
//               >
//                 {keyword}
//               </span>
//             ))}
//           </div>

//           <h3 className="text-2xl font-bold">📜 Summary</h3>
//           <div className="text-lg">
//             <ReactMarkdown>{exampleData.summary}</ReactMarkdown>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Floating Chat Button */}
//       <button
//         className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center"
//         onClick={() => setIsChatOpen(!isChatOpen)}
//       >
//         <MessageSquare className="h-6 w-6" />
//       </button>

//       {/* Chat Window */}
//       {isChatOpen && (
//         <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white shadow-xl rounded-lg flex flex-col border border-gray-300">
//           {/* Chat Header */}
//           <div className="bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
//             <span className="font-semibold text-lg">Study Assistant</span>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="text-white text-lg"
//             >
//               ✖
//             </button>
//           </div>

//           {/* Chat Messages */}
//           <Card className="flex-grow overflow-hidden">
//             <CardContent className="h-full flex flex-col overflow-y-auto p-4 space-y-2">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`p-3 rounded-xl text-sm ${
//                     msg.sender === "user"
//                       ? "bg-primary text-primary-foreground self-end ml-auto max-w-[75%]"
//                       : "bg-muted text-foreground max-w-[75%]"
//                   }`}
//                 >
//                   <ReactMarkdown>{msg.text}</ReactMarkdown>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="text-muted-foreground italic text-sm">
//                   Thinking...
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Input Bar */}
//           <div className="relative w-full flex p-3 border-t border-gray-200">
//             <Input
//               className="pl-4 py-2 text-sm focus-visible:ring-primary w-full"
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) =>
//                 e.key === "Enter" && !e.shiftKey && handleSendMessage()
//               }
//               disabled={loading}
//             />
//             <Button
//               onClick={handleSendMessage}
//               className="ml-2 px-4 py-2 text-sm"
//               disabled={loading || input.trim() === ""}
//             >
//               <Send className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudyAssistant;



import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send, MessageCircle, MessageSquare } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter style={materialLight} language={match[1]} wrapLongLines {...props}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const StudyAssistant = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchData = async () => {
    if (query.trim() === "") return;
    setLoading(true);
    setError("");
    
    try {
      // const response = await axios.post("http://127.0.0.1:8000/explaination/", { subtopic: query });
console.log("Fetching data for query:", query); // Debugging line
      const response = await axios.post("http://127.0.0.0:8000/explaination/", {
        subtopic: query, // Ensure the key matches the backend model
      });
      console.log(response)

      
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setData(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full h-[100vh] flex flex-col mx-auto space-y-6 p-6">
      {/* Search Bar for Query Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <Input
          className="pl-12 py-4 text-lg shadow-md focus-visible:ring-primary w-full max-w-2xl"
          placeholder="Enter a topic to learn..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={fetchData} className="absolute right-2 top-2 px-6 py-3 text-lg">
          <MessageCircle className="h-6 w-6 mr-2" /> Search
        </Button>
      </div>

      {/* Display API Data */}
      {loading && <p className="text-lg text-center">Loading...</p>}
      {error && <p className="text-lg text-red-600 text-center">{error}</p>}
      {data && (
        <Card className="p-6 shadow-lg rounded-xl bg-white">
          <CardContent className="space-y-6">
            <h2 className="text-4xl font-bold underline">📌 {data.title || "Understanding the Topic"}</h2>
            <p className="text-lg">{data.content}</p>

            {data.examples && (
              <>
                <h3 className="text-2xl font-bold underline">🔍 Examples</h3>
                <div className="text-lg">
                  <ReactMarkdown>{data.examples}</ReactMarkdown>
                </div>
              </>
            )}

            {data.analogy && (
              <>
                <h3 className="text-2xl font-bold underline">💡 Analogy</h3>
                <p className="text-lg">{data.analogy}</p>
              </>
            )}

            {data.code_example && (
              <>
                <h3 className="text-2xl font-bold underline">🖥️ Code Examples</h3>
                <div className="text-lg">
                  <ReactMarkdown components={components}>{data.code_example}</ReactMarkdown>
                </div>
              </>
            )}

            {data.keywords && (
              <>
                <h3 className="text-2xl font-bold underline">📚 Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg">
                      {keyword}
                    </span>
                  ))}
                </div>
              </>
            )}

            {data.summary && (
              <>
                <h3 className="text-2xl font-bold underline">📜 Summary</h3>
                <div className="text-lg">
                  <ReactMarkdown>{data.summary}</ReactMarkdown>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
};

export default StudyAssistant;
