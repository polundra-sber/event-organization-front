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
  useFindEventQuery,
} from "@/lib/api/events";
import { toast } from "sonner";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { FilterButton } from "@/components/common/FilterButton";
import { FilterModal } from "@/components/common/FilterModal";
import { EventPreviewCard } from "./EventPreviewCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EventFilters extends Record<string, boolean> {
  active: boolean;
  completed: boolean;
}

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<EventFilters>({
    active: true,
    completed: true,
  });
  const [joinStatus, setJoinStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [joinErrorMessage, setJoinErrorMessage] = useState("");

  // Состояния для поиска мероприятия
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [eventIdInput, setEventIdInput] = useState("");
  const [searchedEventId, setSearchedEventId] = useState<number | null>(null);
  const {
    data: foundEvent,
    isLoading: isFindingEvent,
    isError: isFindError,
  } = useFindEventQuery(searchedEventId!, {
    skip: !searchedEventId,
  });

  const filterOptions = [
    { id: "active", label: "Активные мероприятия" },
    { id: "completed", label: "Завершенные мероприятия" },
  ];

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

  const handleJoinEvent = async () => {
    if (!foundEvent) return;

    setActionLoadingId(foundEvent.event_id);
    setJoinStatus("idle");
    setJoinErrorMessage("");

    try {
      await joinEvent(foundEvent.event_id).unwrap();
      setJoinStatus("success");
      toast.success("Заявка на участие отправлена");
      refetch();
    } catch (error) {
      setJoinStatus("error");
      let errorMessage = "Не удалось отправить заявку";

      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { data?: { error?: string } };
        if (errorData.data?.error) {
          errorMessage = errorData.data.error;
        }
      }
      setJoinErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFindEvent = () => {
    const id = parseInt(eventIdInput);
    if (isNaN(id)) {
      toast.error("Введите корректный ID мероприятия");
      return;
    }
    setSearchedEventId(id);
  };

  const filteredEvents = events.filter((event) => {
    if (!appliedFilters.active && !appliedFilters.completed) return true;
    if (appliedFilters.active && event.event_status_name === "активно")
      return true;
    if (appliedFilters.completed && event.event_status_name === "завершено")
      return true;
    return false;
  });

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
              <Link href="/my-stuffs">Мои вещи</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-tasks">Мои задачи</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-debts">Мои долги</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-incomes">Мне должны</Link>
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
          onClick={() => setIsJoinDialogOpen(true)}
        >
          Присоединиться
        </Button>
      </div>

      {/* Filter Button */}
      <div className="flex justify-start mb-6">
        <FilterButton onClick={() => setIsFilterOpen(true)} />
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

      {/* Filter Modal */}
      <FilterModal<EventFilters>
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={appliedFilters}
        onApply={setAppliedFilters}
        options={filterOptions}
        title="Фильтры мероприятий"
      />

      {/* Диалог поиска мероприятия */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Присоединиться к мероприятию</DialogTitle>
          </DialogHeader>

          {!searchedEventId ? (
            <div className="space-y-4">
              <Input
                placeholder="Введите ID мероприятия"
                value={eventIdInput}
                onChange={(e) => setEventIdInput(e.target.value)}
                type="number"
              />
              <Button onClick={handleFindEvent} className="w-full">
                Найти мероприятие
              </Button>
            </div>
          ) : isFindingEvent ? (
            <div className="text-center py-4">Поиск мероприятия...</div>
          ) : isFindError ? (
            <div className="text-center py-4 text-red-500">
              Мероприятие не найдено
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setSearchedEventId(null)}
              >
                Попробовать снова
              </Button>
            </div>
          ) : foundEvent ? (
            <div className="space-y-4">
              <EventPreviewCard
                event_id={foundEvent.event_id}
                event_name={foundEvent.event_name}
                event_date={foundEvent.event_date}
                event_time={foundEvent.event_time}
                location={foundEvent.location}
                event_status_name={foundEvent.event_status_name as EventStatus}
                onJoin={handleJoinEvent}
                isLoading={actionLoadingId === foundEvent.event_id}
                joinStatus={joinStatus}
                errorMessage={joinErrorMessage}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchedEventId(null);
                  setJoinStatus("idle");
                  setJoinErrorMessage("");
                }}
              >
                Найти другое мероприятие
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
