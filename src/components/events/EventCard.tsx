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
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface EventCardProps {
  event_id: number;
  event_name: string;
  event_date: string;
  event_time?: string;
  location?: string;
  role_name: "участник" | "организатор" | "создатель";
  event_status_name?: "активно" | "завершено";
  onLeave?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onComplete?: (id: number) => Promise<void> | void;
  className?: string;
  isLoading?: boolean;
}

export const EventCard = ({
  event_id,
  event_name,
  event_date,
  event_time,
  location,
  role_name,
  event_status_name = "активно",
  onLeave,
  onDelete,
  onComplete,
  className,
  isLoading = false,
}: EventCardProps) => {
  const [actionType, setActionType] = useState<
    "leave" | "delete" | "complete" | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isCompleted = event_status_name === "завершено";
  const isEventDatePassed = new Date(event_date) < new Date();

  const formattedDate = format(new Date(event_date), "d MMMM yyyy", {
    locale: ru,
  });
  const timeString = event_time ? `, ${event_time}` : "";

  const handleAction = async () => {
    try {
      if (actionType === "leave" && onLeave) {
        await onLeave(event_id);
      } else if (actionType === "delete" && onDelete) {
        await onDelete(event_id);
      } else if (actionType === "complete" && onComplete) {
        await onComplete(event_id);
      }
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
    } finally {
      setIsDialogOpen(false);
      setActionType(null);
    }
  };

  const getActionButtons = () => {
    if (isCompleted) return null;

    const buttons = [];

    if (role_name !== "создатель") {
      buttons.push(
        <Button
          key="leave"
          variant="yellow_green"
          onClick={(e) => {
            e.stopPropagation();
            setActionType("leave");
            setIsDialogOpen(true);
          }}
          size="sm"
          disabled={isLoading}
        >
          Покинуть
        </Button>
      );
    }

    if (role_name === "создатель") {
      buttons.push(
        <Button
          key="delete"
          variant="yellow_green"
          onClick={(e) => {
            e.stopPropagation();
            setActionType("delete");
            setIsDialogOpen(true);
          }}
          size="sm"
          disabled={isLoading}
          className="ml-2"
        >
          Удалить
        </Button>
      );

      buttons.push(
        <Button
          key="complete"
          variant="dark_green"
          onClick={(e) => {
            e.stopPropagation();
            setActionType("complete");
            setIsDialogOpen(true);
          }}
          size="sm"
          disabled={isLoading || !isEventDatePassed}
          className="ml-2"
          title={!isEventDatePassed ? "Доступно после даты мероприятия" : ""}
        >
          Завершить
        </Button>
      );
    }

    return buttons;
  };

  const getDialogContent = () => {
    switch (actionType) {
      case "leave":
        return {
          title: "Покинуть мероприятие",
          description: "Вы уверены, что хотите покинуть это мероприятие?",
          confirmLabel: "Покинуть",
        };
      case "delete":
        return {
          title: "Удалить мероприятие",
          description:
            "Вы уверены, что хотите удалить это мероприятие? Это действие нельзя отменить.",
          confirmLabel: "Удалить",
        };
      case "complete":
        return {
          title: "Завершить мероприятие",
          description:
            "Вы уверены, что хотите завершить это мероприятие? После завершения изменить его будет нельзя.",
          confirmLabel: "Завершить",
        };
      default:
        return {
          title: "Подтвердите действие",
          description: "Вы уверены, что хотите выполнить это действие?",
          confirmLabel: "Подтвердить",
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <div className={cn("w-full max-w-full", className)}>
      <Card className="hover:shadow-md transition-shadow duration-200 h-full flex flex-col min-w-0">
        {" "}
        {/* Добавлен min-w-0 */}
        <Link href={`/events/${event_id}`} className="hover:no-underline">
          <CardHeader className="pb-3">
            {/* Название - исправленный перенос */}
            <CardTitle className="text-lg font-semibold break-words overflow-hidden text-ellipsis">
              {event_name}
            </CardTitle>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formattedDate}
              {timeString}
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-2 overflow-hidden">
            {/* Локация - отображаем только если location не null */}
            {location && (
              <div className="flex items-start gap-2 text-sm min-w-0">
                <span className="text-muted-foreground flex-shrink-0">📍</span>
                <span className="break-words overflow-hidden min-w-0">
                  {location}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">👤</span>
              <span className="whitespace-nowrap">
                Роль: <span className="font-medium">{role_name}</span>
              </span>
            </div>

            {event_status_name && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">📊</span>
                <span className="whitespace-nowrap">
                  Статус:{" "}
                  <span
                    className={cn(
                      "font-medium",
                      isCompleted ? "text-green-600" : "text-blue-600"
                    )}
                  >
                    {event_status_name}
                  </span>
                </span>
              </div>
            )}
          </CardContent>
        </Link>
        {!isCompleted && (
          <CardFooter className="justify-end pt-3 border-t">
            <div className="flex flex-wrap gap-2">{getActionButtons()}</div>
          </CardFooter>
        )}
      </Card>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={handleAction}
        confirmLabel={dialogContent.confirmLabel}
        cancelLabel="Отмена"
      />
    </div>
  );
};
