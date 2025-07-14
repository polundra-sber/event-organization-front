"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";

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

export const EventDetailedCard = ({
  event,
  isCreator,
  onEdit,
}: EventDetailedCardProps) => {
  const roleName = event.role_name as EventRole;
  const statusName = event.event_status_name as EventStatus | undefined;

  const formattedDate = format(new Date(event.event_date), "d MMMM yyyy", {
    locale: ru,
  });
  const timeString = event.event_time ? `, ${event.event_time}` : "";
  const isActive = statusName === "активно";

  return (
    <div className="w-full max-w-full">
      <Card className="border-none shadow-sm w-full min-w-0">
        <CardHeader className="">
          {/* Заголовок с переносом */}
          <CardTitle className="text-xl font-semibold md:text-2xl lg:text-3xl break-words overflow-hidden">
            {event.event_name}
          </CardTitle>
          {/* Дата в одну строку */}
          <div className="text-sm text-muted-foreground md:text-base whitespace-nowrap">
            {formattedDate}
            {timeString}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 overflow-hidden">
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