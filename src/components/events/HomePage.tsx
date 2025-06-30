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
import {
  useGetEventsQuery,
  useLeaveEventMutation,
  useDeleteEventMutation,
  useCompleteEventMutation,
  useJoinEventMutation,
} from "@/lib/api/events";
import { toast } from "sonner";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const HomePageContent = () => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError,
    refetch,
  } = useGetEventsQuery();

  const [leaveEvent] = useLeaveEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [completeEvent] = useCompleteEventMutation();
  const [joinEvent] = useJoinEventMutation();

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    active: true,
    completed: true,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    active: true,
    completed: true,
  });

  const handleAction = async (
    id: number,
    actionType: "leave" | "delete" | "complete" | "join"
  ) => {
    setActionLoadingId(id);
    try {
      switch (actionType) {
        case "leave":
          await leaveEvent(id).unwrap();
          toast.success("Вы покинули мероприятие");
          break;
        case "delete":
          await deleteEvent(id).unwrap();
          toast.success("Мероприятие удалено");
          break;
        case "complete":
          await completeEvent(id).unwrap();
          toast.success("Мероприятие завершено");
          break;
        case "join":
          await joinEvent(id).unwrap();
          toast.success("Заявка на участие отправлена");
          break;
      }
      refetch();
    } catch (error) {
      toast.error("Произошла ошибка");
      console.error(`Ошибка при выполнении действия ${actionType}:`, error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    // Если ни один фильтр не выбран, показываем все мероприятия
    if (!appliedFilters.active && !appliedFilters.completed) return true;
    if (appliedFilters.active && event.event_status_name === "активно")
      return true;
    if (appliedFilters.completed && event.event_status_name === "завершено")
      return true;
    return false;
  });

  const openFilterDialog = () => {
    setTempFilters(appliedFilters);
    setIsFilterDialogOpen(true);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterDialogOpen(false);
  };

  if (isEventsLoading)
    return <div className="text-center py-8">Загрузка мероприятий...</div>;
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
      <div className="flex gap-4 mb-4">
        <Button variant="secondary" className="flex-1" asChild>
          <Link href="/events/create-event">Создать</Link>
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            const eventId = prompt("Введите ID мероприятия для присоединения");
            if (eventId) {
              handleAction(Number(eventId), "join");
            }
          }}
        >
          Присоединиться
        </Button>
      </div>

      {/* Filter Button - теперь в одной строке с другими кнопками */}
      <div className="flex justify-start mb-6">
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={openFilterDialog}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Фильтры
        </Button>
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {events.length === 0
              ? "У вас нет мероприятий. Создайте первое!"
              : "Нет мероприятий, соответствующих выбранным фильтрам"}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event_id={event.event_id}
              event_name={event.event_name}
              event_date={event.event_date}
              event_time={event.event_time}
              location={event.location}
              role_name={event.role_name as EventRole}
              event_status_name={event.event_status_name as EventStatus}
              onLeave={() => handleAction(event.event_id, "leave")}
              onDelete={() => handleAction(event.event_id, "delete")}
              onComplete={() => handleAction(event.event_id, "complete")}
              isLoading={actionLoadingId === event.event_id}
            />
          ))
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Фильтры мероприятий</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active-events"
                checked={tempFilters.active}
                onCheckedChange={(checked) =>
                  setTempFilters({ ...tempFilters, active: !!checked })
                }
              />
              <Label htmlFor="active-events">Активные мероприятия</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed-events"
                checked={tempFilters.completed}
                onCheckedChange={(checked) =>
                  setTempFilters({ ...tempFilters, completed: !!checked })
                }
              />
              <Label htmlFor="completed-events">Завершенные мероприятия</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={applyFilters}>Применить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
