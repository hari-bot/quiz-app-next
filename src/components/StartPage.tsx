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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to the Quiz
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <Button type="submit" className="w-full py-3 text-lg">
          Start Quiz
        </Button>
      </form>
    </div>
  );
}
