"use client";

import { EventDetailedCard } from "./EventDetailedCard";
import { useGetEventByIdQuery } from "@/lib/api/events-api";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { Pencil } from "lucide-react";
import { ButtonToMain } from "@/components/common/ButtonToMain";
import {
  User,
  ShoppingCart,
  Package,
  ListChecks,
  HandCoins,
} from "lucide-react";
import { MyListsMenu } from "@/components/common/MyListsMenu";

export function EventPage() {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventByIdQuery(Number(eventId));

  if (isLoading) return <div className="text-center py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Ошибка загрузки мероприятия
      </div>
    );
  if (!event)
    return (
      <div className="text-center py-8 text-gray-500">
        Мероприятие не найдено
      </div>
    );

  const isCreator = event.role_name === "создатель";
  const isActive = event.event_status_name === "активно";

  const handleEdit = () => {
    router.push(`/events/${event.event_id}/edit`);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 relative">
        <MyListsMenu />

        <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
          Мероприятие
        </h1>
      </header>

      {/* Кнопка назад и редактирования */}
      <div className="flex justify-between items-center mb-6">
        <ButtonToMain />
        {isCreator && isActive && (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full -mt-7"
          >
            <Link href={`/events/${event.event_id}/edit`}>
              <Pencil className="h-6 w-6" />{" "}
            </Link>
          </Button>
        )}
      </div>

      {/* Навигационные кнопки - круглые с иконками */}
      <div className="flex justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href={`/events/${event.event_id}/participants-list`}>
            <User className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href={`/events/${event.event_id}/purchases-list`}>
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href={`/events/${event.event_id}/stuffs-list`}>
            <Package className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href={`/events/${event.event_id}/tasks-list`}>
            <ListChecks className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          asChild
        >
          <Link href={`/events/${event.event_id}/cost-list`}>
            <HandCoins className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Карточка мероприятия */}
      <div className="w-full">
        <EventDetailedCard
          event={{
            ...event,
            role_name: event.role_name as EventRole,
            event_status_name: event.event_status_name as
              | EventStatus
              | undefined,
          }}
          isCreator={isCreator}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
