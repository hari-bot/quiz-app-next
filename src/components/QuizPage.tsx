"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuestionNavigation from "./QuestionNavigation";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizPageProps {
  onEnd: (answers: string[]) => void;
}

const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch("https://opentdb.com/api.php?amount=15");
  const data = await response.json();
  return data.results;
};

export default function QuizPage({ onEnd }: QuizPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(15).fill(""));
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [visited, setVisited] = useState<boolean[]>(Array(15).fill(false));

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onEnd(userAnswers);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEnd, userAnswers]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    const newAttempted = [...visited];
    newAttempted[currentQuestion] = true;
    setVisited(newAttempted);
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
    const newVisited = [...visited];
    newVisited[index] = true;
    setVisited(newVisited);
  };

  const submitQuiz = () => {
    onEnd(userAnswers);
  };

  if (isLoading) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading questions. Please try again.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="text-center">No questions available.</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  const allChoices = [
    currentQuestionData.correct_answer,
    ...currentQuestionData.incorrect_answers,
  ];

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Time left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="mb-4 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
      <Card className="mb-6 transition-all duration-300 ease-in-out transform hover:shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Question {currentQuestion + 1}
          </h2>
          <p
            className="mb-6 text-lg"
            dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}
          ></p>
          <div className="space-y-3">
            {allChoices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(choice)}
                variant={
                  userAnswers[currentQuestion] === choice
                    ? "default"
                    : "outline"
                }
                className={`w-full justify-start text-left py-3 px-4 text-lg mb-2 transition-all duration-200 ${
                  userAnswers[currentQuestion] === choice
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <span dangerouslySetInnerHTML={{ __html: choice }}></span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-between">
        <Button
          onClick={() => navigateToQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          Previous
        </Button>
        <Button
          onClick={() => navigateToQuestion(currentQuestion + 1)}
          disabled={currentQuestion === questions.length - 1}
          className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          Next
        </Button>
      </div>
      <QuestionNavigation
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        visited={visited}
        attempted={userAnswers.map(Boolean)}
        onNavigate={navigateToQuestion}
      />
      <Button
        onClick={submitQuiz}
        className="mt-6 w-full py-3 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300"
      >
        Submit Quiz
      </Button>
    </div>
  );
}
