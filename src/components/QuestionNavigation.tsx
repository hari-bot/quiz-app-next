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
          className={`w-full transition-all duration-200 ${
            currentQuestion === i
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : attempted[i]
              ? "bg-green-100 hover:bg-green-200"
              : visited[i]
              ? "bg-blue-100 hover:bg-blue-200"
              : "hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
