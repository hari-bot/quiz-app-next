"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import StartPage from "@/components/StartPage";
import QuizPage from "@/components/QuizPage";
import ReportPage from "@/components/ReportPage";

const queryClient = new QueryClient();

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch("https://opentdb.com/api.php?amount=15");
  const data = await response.json();
  return data.results;
};

function QuizApp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: Infinity, // This ensures the data is never considered stale
  });

  const startQuiz = (email: string) => {
    setEmail(email);
    setQuizStarted(true);
  };

  const endQuiz = (answers: string[]) => {
    setUserAnswers(answers);
    setQuizEnded(true);
  };

  if (isLoading) return <div className="text-center">Loading questions...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error loading questions. Please try again.
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
        {!quizStarted && !quizEnded && <StartPage onStart={startQuiz} />}
        {quizStarted && !quizEnded && (
          <QuizPage questions={questions!} onEnd={endQuiz} />
        )}
        {quizEnded && (
          <ReportPage questions={questions!} userAnswers={userAnswers} />
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizApp />
    </QueryClientProvider>
  );
}
