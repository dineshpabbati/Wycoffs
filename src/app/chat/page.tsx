"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Home as HomeIcon, LogOut } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const [messages, setMessages] = useState<
    { id: string; content: string; sender: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRAGResponse = async (query: string): Promise<string> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch response: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now().toString(), content: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRAGResponse(input);
      const botMessage = { id: Date.now().toString(), content: response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Error fetching response:", err);
      setError("Failed to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed h-full w-full bg-gray-100">
      <nav className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white flex justify-between items-center shadow-lg transform transition-transform duration-500 ease-in-out">
        <div className="flex items-center space-x-4">
          <HomeIcon size={24} />
          <div className="text-lg font-semibold">Wyckoff Chatbot</div>
          
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
              <span>Sign In</span>
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          </SignOutButton>
        </SignedIn>
      </nav>

      <div className="container mx-auto h-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`mb-4 flex ${
                message.sender === "bot" ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <CardHeader className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full ${message.sender === "bot" ? "bg-blue-500" : "bg-purple-500"}`}></div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-auto relative p-4 mb-12">
          <div className="flex items-center">
            <Textarea
              className="w-full text-lg p-4 border border-gray-300 rounded-lg"
              placeholder="Message ChatAi"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input || loading}
              className="ml-4 p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
            >
              <Send size={24} />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
