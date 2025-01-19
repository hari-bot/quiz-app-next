import { Button } from "@/components/ui/button";

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
    <div className="mt-4 grid grid-cols-5 gap-2">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <Button
          key={i}
          onClick={() => onNavigate(i)}
          variant={currentQuestion === i ? "default" : "outline"}
          className={`w-full ${visited[i] ? "!bg-blue-100" : ""} ${
            attempted[i] ? "!bg-green-100" : ""
          }`}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
