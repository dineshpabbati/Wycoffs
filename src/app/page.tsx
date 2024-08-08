'use client';
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Send, LogOut, Home as HomeIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

export default function Home() {
  let { messages, handleSubmit, input, handleInputChange, error } = useChat();
  console.log('Messages:', messages);
  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <main className="fixed h-full w-full bg-gray-100">

      <nav className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white flex justify-between items-center shadow-lg transform transition-transform duration-500 ease-in-out">
        <div className="flex items-center space-x-4">
          <HomeIcon size={24} />
          <div className="text-lg font-semibold">Support Bot</div>
        </div>
        {/* TODO - add sign out feature */}
        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
          <LogOut size={18} />
          <span>Sign Out</span>
        </Button>
      </nav>
      
      <div className="container mx-auto h-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <Card key={message.id} className="mb-4 flex">
              <CardHeader className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                {/* <CardTitle className="text-lg">{message.sender}</CardTitle> */}
              </CardHeader>
              <CardContent >
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
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input}
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
