"use client";

import { Card, CardContent } from "@/components/ui/card";
import parse from "html-react-parser";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface ReportPageProps {
  questions: Question[];
  userAnswers: string[];
}

export default function ReportPage({
  questions,
  userAnswers,
}: ReportPageProps) {
  const totalCorrect = questions.reduce((sum, question, index) => {
    return sum + (userAnswers[index] === question.correct_answer ? 1 : 0);
  }, 0);

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Quiz Report
      </h1>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Score</h2>
        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          {totalCorrect} / {questions.length}
        </p>
        <p className="text-lg mt-2">
          ({((totalCorrect / questions.length) * 100).toFixed(2)}%)
        </p>
      </div>
      {questions.map((question, index) => (
        <Card
          key={index}
          className="mb-6 transition-all duration-300 ease-in-out transform hover:shadow-lg"
        >
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-3">Question {index + 1}</h2>
            <p
              className="mb-4 text-lg"
              dangerouslySetInnerHTML={{ __html: question.question }}
            ></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg transition-all duration-200 hover:shadow-md">
                <h3 className="font-bold mb-2 text-blue-600">Your Answer:</h3>
                <p
                  className={`text-lg ${
                    userAnswers[index] === question.correct_answer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parse(userAnswers[index]) || "Not answered"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg transition-all duration-200 hover:shadow-md">
                <h3 className="font-bold mb-2 text-green-600">
                  Correct Answer:
                </h3>
                <p className="text-lg text-green-600">
                  {parse(question.correct_answer)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
