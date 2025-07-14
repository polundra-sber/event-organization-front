"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { EventStatus } from "@/lib/api/types/event-types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EventPreviewCardProps {
  event_id: number;
  event_name: string;
  event_date: string;
  event_time?: string;
  location?: string;
  event_status_name?: EventStatus;
  onJoin: () => Promise<void>;
  isLoading?: boolean;
  joinStatus?: "idle" | "success" | "error";
  errorMessage?: string;
}

export const EventPreviewCard = ({
  event_name,
  event_date,
  event_time,
  location = "место не указано",
  event_status_name = "активно",
  onJoin,
  isLoading = false,
}: EventPreviewCardProps) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const formattedDate = format(new Date(event_date), "d MMMM yyyy", {
    locale: ru,
  });
  const timeString = event_time ? `, ${event_time}` : "";
  const isCompleted = event_status_name === "завершено";

  const handleJoin = async () => {
    setIsButtonClicked(true);
    await onJoin();
  };

  return (
    <Card className="w-full max-w-full min-w-0">
      <CardHeader className="min-w-0">
        <CardTitle className="text-lg break-words overflow-hidden">
          {event_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 min-w-0">
        <div className="text-sm whitespace-nowrap">
          <span className="text-muted-foreground">Дата: </span>
          <span>
            {formattedDate}
            {timeString}
          </span>
        </div>
        <div className="text-sm min-w-0">
          <span className="text-muted-foreground">Место: </span>
          <span className="break-words">{location}</span>
        </div>
        <div className="text-sm whitespace-nowrap">
          <span className="text-muted-foreground">Статус: </span>
          <span
            className={cn(
              isCompleted ? "text-green-600" : "text-blue-600",
              "font-medium"
            )}
          >
            {event_status_name}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleJoin}
          disabled={isCompleted || isLoading || isButtonClicked}
          className="w-full"
        >
          {isLoading ? "Отправка..." : "Присоединиться"}
        </Button>
      </CardFooter>
    </Card>
  );
};