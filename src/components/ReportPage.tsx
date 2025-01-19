"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface ReportPageProps {
  userAnswers: string[];
}

const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch("https://opentdb.com/api.php?amount=15");
  const data = await response.json();
  return data.results;
};

export default function ReportPage({ userAnswers }: ReportPageProps) {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

  if (isLoading) {
    return <div className="text-center">Loading report...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading report. Please try again.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center">No questions available for the report.</div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Report</h1>
      {questions.map((question, index) => (
        <Card key={index} className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-3">Question {index + 1}</h2>
            <p
              className="mb-4 text-lg"
              dangerouslySetInnerHTML={{ __html: question.question }}
            ></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Your Answer:</h3>
                <p
                  className={`text-lg ${
                    userAnswers[index] === question.correct_answer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {userAnswers[index] || "Not answered"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Correct Answer:</h3>
                <p className="text-lg text-green-600">
                  {question.correct_answer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
