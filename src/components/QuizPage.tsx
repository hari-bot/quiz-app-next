"use client";

import { useState, useEffect } from "react";
import { Button, Card, Flex, Text, Heading, Box } from "@radix-ui/themes";
import QuestionNavigation from "./QuestionNavigation";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizPageProps {
  onEnd: (answers: string[]) => void;
}

export default function QuizPage({ onEnd }: QuizPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [visited, setVisited] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswers(Array(questions.length).fill(""));
      setVisited(Array(questions.length).fill(false));
    }
  }, [questions]);

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

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=15");
      const data = await response.json();

      if (Array.isArray(data.results)) {
        setQuestions(data.results);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]); // Set to an empty array to handle the error gracefully
    } finally {
      setIsLoading(false);
    }
  };

  // Later in the component render method
  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Text size="5">Loading questions...</Text>
      </Flex>
    );
  }

  if (questions.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Text size="5">Failed to load questions. Please try again later.</Text>
      </Flex>
    );
  }

  const handleAnswer = (answer: string) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setVisited((prev) => {
      const newVisited = [...prev];
      newVisited[index] = true;
      return newVisited;
    });
  };

  const submitQuiz = () => {
    onEnd(userAnswers);
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Text size="5">Loading questions...</Text>
      </Flex>
    );
  }

  if (questions.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Text size="5">Failed to load questions. Please try again later.</Text>
      </Flex>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const allChoices = [
    currentQuestionData.correct_answer,
    ...currentQuestionData.incorrect_answers,
  ];

  return (
    <Flex
      direction="column"
      gap="4"
      style={{ maxWidth: "800px", width: "100%" }}
    >
      <Text align="center" size="5">
        Time left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Text>
      <Card>
        <Box p="4">
          <Flex direction="column" gap="3">
            <Heading size="4">Question {currentQuestion + 1}</Heading>
            <Text
              dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}
            ></Text>
            <Flex direction="column" gap="2">
              {allChoices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  variant={
                    userAnswers[currentQuestion] === choice
                      ? "solid"
                      : "outline"
                  }
                >
                  <span dangerouslySetInnerHTML={{ __html: choice }}></span>
                </Button>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Card>
      <Flex justify="between">
        <Button
          onClick={() => navigateToQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => navigateToQuestion(currentQuestion + 1)}
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </Button>
      </Flex>
      <QuestionNavigation
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        visited={visited}
        attempted={userAnswers.map(Boolean)}
        onNavigate={navigateToQuestion}
      />
      <Button onClick={submitQuiz}>Submit Quiz</Button>
    </Flex>
  );
}
