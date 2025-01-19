"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StartPage from "@/components/StartPage";
import QuizPage from "@/components/QuizPage";
import ReportPage from "@/components/ReportPage";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-100">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6">
          {!quizStarted && !quizEnded && <StartPage onStart={startQuiz} />}
          {quizStarted && !quizEnded && <QuizPage onEnd={endQuiz} />}
          {quizEnded && <ReportPage userAnswers={userAnswers} />}
        </div>
      </main>
    </QueryClientProvider>
  );
}
