"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Message, Concept } from "@/types/chat";
import { Send, ArrowLeft, ExternalLink, BookOpen, Brain } from "lucide-react";

interface ChatInterfaceProps {
  concept: Concept;
  onBack: () => void;
  onSwitchToConcept: (concept: Concept) => void;
  onToggleSidebar: () => void;
}

export function ChatInterface({ concept, onBack, onSwitchToConcept, onToggleSidebar }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = useCallback(async () => {
    setIsLoading(true);
    setMessages([]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [],
          conceptId: concept.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages([assistantMessage]);
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [concept.id]);

  useEffect(() => {
    startConversation();
  }, [concept, startConversation]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          conceptId: concept.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
              >
                <BookOpen className="h-5 w-5" />
              </button>
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            
            {/* Center */}
            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="font-semibold text-white text-base sm:text-lg">{concept.name}</h1>
              <p className="text-xs sm:text-sm text-gray-400">{concept.category}</p>
            </div>

            {/* Right Side */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <a
                href={concept.paperReference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-white hover:bg-gray-100 text-black rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Original Paper</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mt-1">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`flex-1 ${message.role === "user" ? "ml-12" : ""}`}>
                  <div className={`${
                    message.role === "user" 
                      ? "bg-gray-800 border border-gray-700" 
                      : "bg-gray-900 border border-gray-800"
                  } rounded-xl p-4`}>
                    <div className="prose prose-gray max-w-none">
                      {message.content.split('\n').map((paragraph, pIndex) => (
                        paragraph.trim() && (
                          <p key={pIndex} className="mb-3 last:mb-0 text-gray-100 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="flex items-center justify-end mt-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-medium">You</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mt-1">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-gray-400 text-sm">thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={sendMessage} className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this concept..."
                  className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Press Enter to send • Ask questions, request examples, or dive deeper into any aspect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 