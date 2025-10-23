import { Card } from "@/components/ui/card";
import { Award, Flame, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface GamificationBadgeProps {
  score: number;
  streak: number;
  rank: string;
  level: number;
}

export const GamificationBadge = ({ score, streak, rank, level }: GamificationBadgeProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary via-primary-glow to-accent">
      <div className="flex items-center justify-between text-primary-foreground">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Carbon Efficiency</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-sm opacity-75">points</span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Award className="h-16 w-16 opacity-90 mb-2" />
          <div className="text-sm font-bold">{rank}</div>
        </div>
      </div>
    </Card>
  );
};
