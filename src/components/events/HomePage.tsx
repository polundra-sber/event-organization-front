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

export const HomePageContent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "День рождения Марии",
      date: "15 июля, 19:00",
      location: "Кафе «Уют»",
      role: "участник",
    },
    {
      id: 2,
      title: "Пикник в парке",
      date: "20 июля, 19:00",
      location: "Центральный парк",
      role: "организатор",
    },
  ]);

  const [leavingId, setLeavingId] = useState<number | null>(null);

  // TODO: спрашивать об удалении
  const handleLeave = async (id: number) => {
    setLeavingId(id);
    try {
      // Здесь должен быть реальный API-запрос
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация запроса

      // Удаляем мероприятие из списка
      setEvents((prev) => prev.filter((event) => event.id !== id));

      console.log(`Мероприятие ${id} успешно покинуто`);
    } catch (error) {
      console.error("Ошибка при покидании мероприятия:", error);
    } finally {
      setLeavingId(null);
    }
  };

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
            <DropdownMenuItem>Мои покупки</DropdownMenuItem>
            <DropdownMenuItem>Мои вещи</DropdownMenuItem>
            <DropdownMenuItem>Мои задачи</DropdownMenuItem>
            <DropdownMenuItem>Мои долги</DropdownMenuItem>
            <DropdownMenuItem>Мне должны</DropdownMenuItem>
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
        <Button variant="secondary" className="flex-1">
          Создать
        </Button>
        <Button variant="secondary" className="flex-1">
          Присоединиться
        </Button>
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            role={event.role}
            onLeave={handleLeave}
            isLeaving={leavingId === event.id}
          />
        ))}
      </div>
    </div>
  );
};
