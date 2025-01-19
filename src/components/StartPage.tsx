"use client";

import { useState } from "react";
import { Button, TextField } from "@radix-ui/themes";

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
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Welcome to the Quiz
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField.Root
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Start Quiz
        </Button>
      </form>
    </div>
  );
}
