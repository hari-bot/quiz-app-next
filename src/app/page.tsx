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
import { Loader2 } from "lucide-react";

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
    staleTime: Infinity,
    retry: 3,
  });

  const startQuiz = (email: string) => {
    setEmail(email);
    setQuizStarted(true);
  };

  const endQuiz = (answers: string[]) => {
    setUserAnswers(answers);
    setQuizEnded(true);
  };

  if (isLoading)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-12 transition-all duration-300 ease-in-out transform hover:shadow-2xl flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Loading Questions...
          </h2>
          <p className="text-gray-500">
            Please wait while we prepare your quiz
          </p>
        </div>
      </main>
    );

  if (isError)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-12 transition-all duration-300 ease-in-out transform hover:shadow-2xl flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl text-red-500">×</span>
          </div>
          <h2 className="text-2xl font-bold text-red-500">
            Error Loading Questions
          </h2>
          <p className="text-gray-500">Please refresh the page and try again</p>
        </div>
      </main>
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
