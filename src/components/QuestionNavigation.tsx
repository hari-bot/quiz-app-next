import { Button, Flex } from "@radix-ui/themes";

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  visited: boolean[];
  attempted: boolean[];
  onNavigate: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  visited,
  attempted,
  onNavigate,
}: QuestionNavigationProps) {
  return (
    <Flex wrap="wrap" gap="2">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <Button
          key={i}
          onClick={() => onNavigate(i)}
          variant={currentQuestion === i ? "solid" : "outline"}
          color={attempted[i] ? "green" : visited[i] ? "blue" : undefined}
        >
          {i + 1}
        </Button>
      ))}
    </Flex>
  );
}
