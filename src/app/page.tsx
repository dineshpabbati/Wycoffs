'use client';
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function Home() {
  const { messages, handleSubmit, input, handleInputChange, error } = useChat();

  console.log('Messages:', messages);
  if (error) {
    console.error('Chat error:', error);
  }
  
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <SignedIn>
      <UserButton />
    <main className="fixed h-full w-full bg-muted">
      <div className="container h-full w-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-full mr-4"></div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-lg">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="mt-auto relative">
          <Textarea
            className="w-full text-lg"
            placeholder="Message ChatAi"
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit"
          size='icon'
          disabled={!input}
          className="absolute top-1/2 transform -translate-y-1/2 right-4 rounded-full">
            <Send size={24} />
          </Button>
        </form>     
      </div>
    </main>
    </SignedIn>
    <SignedOut>
        <SignInButton />
    </SignedOut>
    </ClerkProvider>
  );
}
