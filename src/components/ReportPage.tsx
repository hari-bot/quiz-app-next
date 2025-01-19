"use client";

import { useState, useEffect } from "react";
import { Card, Flex, Text, Heading } from "@radix-ui/themes";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface ReportPageProps {
  userAnswers: string[];
}

export default function ReportPage({ userAnswers }: ReportPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=15");
    const data = await response.json();
    setQuestions(data.results);
  };

  if (questions.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <Flex
      direction="column"
      gap="4"
      style={{ maxWidth: "800px", width: "100%" }}
    >
      <Heading size="5" align="center">
        Quiz Report
      </Heading>
      {questions.map((question, index) => (
        <Card key={index}>
          <Flex direction="column" gap="3" p="4">
            <Heading size="4">Question {index + 1}</Heading>
            <Text
              dangerouslySetInnerHTML={{ __html: question.question }}
            ></Text>
            <Flex>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text weight="bold">Your Answer:</Text>
                <Text
                  color={
                    userAnswers[index] === question.correct_answer
                      ? "green"
                      : "red"
                  }
                >
                  {userAnswers[index] || "Not answered"}
                </Text>
              </Flex>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text weight="bold">Correct Answer:</Text>
                <Text color="green">{question.correct_answer}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
