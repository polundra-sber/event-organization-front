"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetTasksListQuery,
  useTakeTaskFromTasksListMutation,
  useDeleteTaskFromTasksListMutation,
  useAddTaskToTasksListMutation,
} from "@/lib/api/tasks-api";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { toast } from "sonner";
import { TaskListItemCreator } from "@/lib/api/types/tasks-types";
import { Loader } from "@/components/common/Loader";

interface EventTasksPageContentProps {
  event_id: number;
}

export const EventTasksPageContent = ({
  event_id,
}: EventTasksPageContentProps) => {
  const {
    data: tasksResponse,
    isLoading,
    isError,
  } = useGetTasksListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);
  const [takeTask] = useTakeTaskFromTasksListMutation();
  const [deleteTask] = useDeleteTaskFromTasksListMutation();
  const [addTask] = useAddTaskToTasksListMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const handleCreateTask = async (data: TaskListItemCreator) => {
    try {
      await addTask({
        event_id,
        taskData: {
          task_name: data.task_name,
          task_description: data.task_description || null,
          task_status_name: "Новая",
          responsible_login: data.responsible_login || null,
          deadline_date: data.deadline_date,
          deadline_time: data.deadline_time || null,
        },
      }).unwrap();
      toast.success("Задача успешно создана");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Ошибка при создании задачи");
    }
  };

  const tasks = tasksResponse?.tasks || [];

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

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-red-500 text-center p-4">Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 max-w-full overflow-x-hidden">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black">
          Задачи мероприятия
        </label>
      </div>

      <div className="flex justify-between items-center mb-4">
        <FilterButton onClick={() => setIsFilterOpen(true)} />
        {canEditDelete && (
          <Button
            variant="bright_green"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!isEventActive}
          >
            Создать
          </Button>
        )}
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

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <ItemModalForm
              onSubmit={(data) =>
                handleCreateTask({
                  task_name: data.name,
                  task_description: data.description,
                  responsible_login: data.responsible_login,
                  deadline_date: data.deadline_date,
                  deadline_time: data.deadline_time,
                })
              }
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={false}
              submitButtonText="Создать"
              eventDate={tasksResponse?.event_date}
              eventTime={tasksResponse?.event_time || null}
              eventId={event_id}
              showDateTimeFields={true}
              formTitle="Создать новую задачу"
              nameLabel="Название задачи"
              descriptionLabel="Описание задачи"
            />
          </div>
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
