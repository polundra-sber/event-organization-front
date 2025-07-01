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
  event_id,
  event_name,
  event_date,
  event_time,
  location = "место не указано",
  event_status_name = "активно",
  onJoin,
  isLoading = false,
  joinStatus = "idle",
  errorMessage,
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{event_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Дата: </span>
          <span>
            {formattedDate}
            {timeString}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Место: </span>
          <span>{location}</span>
        </div>
        <div className="text-sm">
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

        {joinStatus === "success" && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm">
            Заявка успешно отправлена!
          </div>
        )}
        {joinStatus === "error" && errorMessage && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 rounded text-sm">
            {errorMessage}
          </div>
        )}
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

function cn(...args: string[]) {
  return args.filter(Boolean).join(" ");
}
