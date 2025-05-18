
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your CareerCraft AI assistant. How can I help with your career journey today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response based on user input
    setTimeout(() => {
      let response = "";
      
      if (message.toLowerCase().includes("resume") || message.toLowerCase().includes("cv")) {
        response = "I can help you build a professional resume tailored to your target job. For more detailed assistance, visit our Resume Builder section!";
      } else if (message.toLowerCase().includes("interview")) {
        response = "Interview preparation is key to success. I can provide practice questions for common roles. Would you like to see some examples?";
      } else if (message.toLowerCase().includes("career") || message.toLowerCase().includes("job")) {
        response = "Finding the right career path can be challenging. Our Career Test can help identify roles that match your personality and skills!";
      } else if (message.toLowerCase().includes("help")) {
        response = "I can assist with resume building, interview preparation, career guidance, and more. What specific area would you like help with?";
      } else {
        response = "I'm here to support your career journey. For a more in-depth conversation, check out our full AI Chat feature!";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg flex items-center justify-center p-0 bg-brand-blue hover:bg-brand-navy"
        >
          <MessageSquare size={24} />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-96 flex flex-col shadow-xl animate-fade-in">
          <div className="bg-brand-blue text-white p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <div className="bg-white/20 h-full w-full flex items-center justify-center text-xs font-semibold">
                  AI
                </div>
              </Avatar>
              <span className="font-medium">CareerCraft Assistant</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-brand-blue text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-brand-blue hover:bg-brand-navy"
                size="icon"
                disabled={isLoading}
              >
                <Send size={18} />
              </Button>
            </div>
            <div className="text-xs text-center text-gray-500">
              <Link to="/ai-chat" className="text-brand-blue hover:underline">
                Open full chat assistant
              </Link>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
