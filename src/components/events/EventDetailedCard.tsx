"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

interface EventDetailedCardProps {
  event: {
    event_id: number;
    event_name: string;
    event_date: string;
    event_time?: string;
    location?: string;
    role_name: EventRole;
    event_status_name?: EventStatus;
    event_description?: string;
    chat_link?: string;
  };
  isCreator: boolean;
  onEdit: () => void;
}

export const EventDetailedCard = ({ event }: EventDetailedCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const roleName = event.role_name as EventRole;
  const statusName = event.event_status_name as EventStatus | undefined;

  const formattedDate = format(new Date(event.event_date), "d MMMM yyyy", {
    locale: ru,
  });
  const timeString = event.event_time ? `, ${event.event_time}` : "";
  const isActive = statusName === "активно";

  const copyIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(event.event_id.toString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      toast("ID скопирован");
    } catch (err) {
      toast("Ошибка копирования");
    }
  };

  return (
    <div className="w-full max-w-full">
      <Card className="border-none shadow-sm w-full min-w-0">
        <CardHeader className="">
          <CardTitle className="text-xl font-semibold md:text-2xl lg:text-3xl break-words overflow-hidden">
            {event.event_name}
          </CardTitle>
          <div className="text-sm text-muted-foreground md:text-base whitespace-nowrap">
            {formattedDate}
            {timeString}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 overflow-hidden">
          {/* Улучшенный блок с ID мероприятия */}
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-muted-foreground">🔢</span>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">ID мероприятия:</span>
              <div className="relative group">
                <div className="flex items-center gap-1 bg-muted/50 hover:bg-muted px-2 py-1 rounded-md transition-colors cursor-pointer">
                  <span className="font-medium">{event.event_id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:bg-transparent group-hover:text-foreground"
                    onClick={copyIdToClipboard}
                    title="Копировать ID"
                  >
                    {isCopied ? (
                      <CheckIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <CopyIcon className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="absolute -bottom-6 left-0 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Нажмите, чтобы скопировать
                </div>
              </div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-2 text-sm md:text-base min-w-0">
              <span className="text-muted-foreground flex-shrink-0">📍</span>
              <span className="break-words overflow-hidden min-w-0">
                {event.location}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-muted-foreground">👤</span>
            <span className="whitespace-nowrap">
              Роль: <span className="font-medium">{roleName}</span>
            </span>
          </div>

          {statusName && (
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-muted-foreground">📊</span>
              <span className="whitespace-nowrap">
                Статус:{" "}
                <span
                  className={cn(
                    "font-medium",
                    isActive ? "text-green-600" : "text-blue-600"
                  )}
                >
                  {statusName}
                </span>
              </span>
            </div>
          )}

          {event.chat_link && (
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-muted-foreground">💬</span>
              <Link
                href={event.chat_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline break-all"
              >
                Чат мероприятия
              </Link>
            </div>
          )}

          {event.event_description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2 md:text-base">
                Описание:
              </p>
              <p className="text-sm md:text-base break-words">
                {event.event_description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
