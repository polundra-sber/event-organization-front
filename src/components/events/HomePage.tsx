"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EventCard } from "./EventCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useGetEventsQuery } from "@/lib/api/events";

// Вынести в event-types и сравнить с openapi
type ApiEvent = {
  event_id: number;
  event_name: string;
  event_date: string;
  event_time?: string;
  location?: string;
  role_name: "участник" | "организатор" | "создатель";
  event_status_name?: "активно" | "завершено";
};

export const HomePageContent = () => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError,
  } = useGetEventsQuery();
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const handleAction = async (
    id: number,
    actionType: "leave" | "delete" | "complete"
  ) => {
    setActionLoadingId(id);
    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        `Мероприятие ${id} ${
          actionType === "leave"
            ? "покинуто"
            : actionType === "delete"
            ? "удалено"
            : "завершено"
        }`
      );
    } catch (error) {
      console.error(`Ошибка при выполнении действия ${actionType}:`, error);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isEventsLoading) return null;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Ошибка загрузки мероприятий
      </div>
    );

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/my-purchases">Мои покупки</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-items">Мои вещи</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-tasks">Мои задачи</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-debts">Мои долги</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/owed-to-me">Мне должны</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl font-bold">Мероприятия</h1>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">Профиль</Link>
          </Button>
          <Avatar>
            <AvatarFallback>&gt;.&lt;</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <Button variant="secondary" className="flex-1" asChild>
          <Link href="/events/create-event">Создать</Link>
        </Button>
        <Button variant="secondary" className="flex-1" disabled>
          Присоединиться
        </Button>
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            У вас нет мероприятий. Создайте первое!
          </div>
        ) : (
          (events as ApiEvent[]).map((event) => (
            <EventCard
              key={event.event_id}
              event_id={event.event_id}
              event_name={event.event_name}
              event_date={event.event_date}
              event_time={event.event_time}
              location={event.location}
              role_name={event.role_name}
              event_status_name={event.event_status_name}
              onLeave={() => handleAction(event.event_id, "leave")}
              onDelete={() => handleAction(event.event_id, "delete")}
              onComplete={() => handleAction(event.event_id, "complete")}
              isLoading={actionLoadingId === event.event_id}
            />
          ))
        )}
      </div>
    </div>
  );
};
