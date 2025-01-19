"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StartPageProps {
  onStart: (email: string) => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onStart(email);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Welcome to the Quiz
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <Button
          type="submit"
          className="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          Start Quiz
        </Button>
      </form>
    </div>
  );
}
