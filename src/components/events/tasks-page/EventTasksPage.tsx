"use client";

import { useState } from "react";
import {
  useGetTasksListQuery,
  useTakeTaskFromTasksListMutation,
  useDeleteTaskFromTasksListMutation,
} from "@/lib/api/tasks-api";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import Link from "next/link";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";

interface EventTasksPageContentProps {
  event_id: number;
}

export const EventTasksPageContent = ({
  event_id,
}: EventTasksPageContentProps) => {
  const {
    data: tasksData,
    isLoading,
    isError,
  } = useGetTasksListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);
  const [takeTask] = useTakeTaskFromTasksListMutation();
  const [deleteTask] = useDeleteTaskFromTasksListMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    completed: false,
    active: false,
  });

  const userRole: EventRole = (metadata?.role_name as EventRole) || "участник";
  const eventStatus: EventStatus =
    (metadata?.event_status_name as EventStatus) || "активно";
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const tasks = tasksData || [];

  const filteredTasks = tasks.filter((task) => {
    if (!filters.completed && !filters.active) return true;

    if (
      filters.completed &&
      task.task_status_name.toLowerCase() === "выполнена"
    ) {
      return true;
    }

    if (filters.active && task.task_status_name.toLowerCase() !== "выполнена") {
      return true;
    }

    return false;
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>
      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black text-lg">
          Задачи мероприятия
        </label>
      </div>
      <div className="flex justify-between items-center mb-4">
        {canEditDelete && (
          <Button variant="bright_green" disabled={!isEventActive}>
            Создать
          </Button>
        )}
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет задач</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              isOpen={openedDescriptionId === task.task_id}
              userRole={userRole}
              eventStatus={eventStatus}
              onToggleDescription={toggleDescription}
              onTakeTask={
                isEventActive
                  ? async ({ event_id, task_id }) => {
                      const result = await takeTask({
                        event_id,
                        task_id,
                      }).unwrap();
                      return result;
                    }
                  : undefined
              }
              onDeleteTask={
                isEventActive
                  ? async ({ event_id, task_id }) => {
                      await deleteTask({ event_id, task_id }).unwrap();
                    }
                  : undefined
              }
              event_id={event_id}
            />
          ))}
        </div>
      )}
      <FilterModal
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={filters}
        onApply={setFilters}
        options={[
          { id: "completed", label: "Выполненные" },
          { id: "active", label: "Активные" },
        ]}
      />
    </div>
  );
};
