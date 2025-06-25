"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  role: string;
  onLeave: (id: number) => Promise<void> | void;
  className?: string;
  isLeaving?: boolean;
}

export const EventCard = ({
  id,
  title,
  date,
  location,
  role,
  onLeave,
  className,
  isLeaving = false,
}: EventCardProps) => {
  const handleLeave = async () => {
    try {
      await onLeave(id);
    } catch (error) {
      console.error("Ошибка при покидании мероприятия:", error);
    }
  };

  return (
    <div className={cn("w-full transition-all hover:scale-[1.02]", className)}>
      <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
        <CardHeader className="pb-3 space-y-1">
          <CardTitle className="text-xl font-semibold text-foreground">
            {title}
          </CardTitle>
          <div className="text-sm text-muted-foreground">📅 {date}</div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">📍</span>
            <span className="text-foreground">{location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">👤</span>
            <span className="text-foreground">
              Роль: <span className="font-medium text-primary">{role}</span>
            </span>
          </div>
        </CardContent>

        <CardFooter className="justify-end pt-3">
          <Button
            variant="destructive"
            onClick={handleLeave}
            size="sm"
            disabled={isLeaving}
            className="transition-all hover:shadow-md hover:bg-destructive/90"
          >
            {isLeaving ? "Покидаем..." : "Покинуть мероприятие"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
