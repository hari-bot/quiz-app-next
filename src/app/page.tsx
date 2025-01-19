"use client";

import { useState } from "react";
import StartPage from "@/components/StartPage";

export default function Home() {
  const [email, setEmail] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const startQuiz = (email: string) => {
    setEmail(email);
    setQuizStarted(true);
  };

  const endQuiz = (answers: string[]) => {
    setUserAnswers(answers);
    setQuizEnded(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!quizStarted && !quizEnded && <StartPage onStart={startQuiz} />}
    </main>
  );
}
