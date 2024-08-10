'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";
import { useAuth, SignedOut, SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/chat');
    }
  }, [isSignedIn, router]);
  
  return (
    <main className="h-full w-full bg-gray-100">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <HomeIcon size={24} />
          <div className="text-lg font-semibold">Support Bot</div>
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Support Bot</h1>
        <p className="text-lg text-gray-700 mb-8">
          Your AI-powered assistant for instant support. Chat with our intelligent bot to get help with your queries anytime, anywhere.
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 text-lg font-semibold rounded-lg transform transition-transform duration-300 hover:scale-105">
              Get Started
            </Button>
          </SignInButton>
        </SignedOut>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Why Choose Support Bot?</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Responses</h3>
                <p className="text-gray-700">Get instant answers to your questions with our AI-powered chat.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-gray-700">Our bot is always online, ready to assist you anytime you need help.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Friendly</h3>
                <p className="text-gray-700">Simple and intuitive interface that makes chatting easy and enjoyable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p className="text-sm">&copy; 2024 Support Bot. All rights reserved.</p>
      </footer>

    </main>
  );
}

