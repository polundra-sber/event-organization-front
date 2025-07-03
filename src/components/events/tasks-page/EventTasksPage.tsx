"use client";

import { useState } from "react";
import {
  useGetTasksListQuery,
  useTakeTaskFromTasksListMutation,
  useDeleteTaskFromTasksListMutation,
} from "@/lib/api/tasks-api";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ButtonToMain } from "@/components/common/ButtonToMain";

interface EventTasksPageContentProps {
  event_id: number;
}

export const EventTasksPageContent = ({
  event_id,
}: EventTasksPageContentProps) => {
  const { data, isLoading, isError } = useGetTasksListQuery(event_id);
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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    task_id: number;
    task_name: string;
  } | null>(null);

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const openConfirmDialog = (task: { task_id: number; task_name: string }) => {
    setSelectedTask(task);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      try {
        await deleteTask({
          event_id,
          task_id: selectedTask.task_id,
        }).unwrap();
        toast.success("Задача удалена");
      } catch {
        toast.error("Ошибка при удалении");
      } finally {
        setConfirmDialogOpen(false);
        setSelectedTask(null);
      }
    }
  };

  const tasks = data || [];

  const filteredTasks = tasks.filter((task) => {
    // Если не выбран ни один фильтр - показываем все задачи
    if (!filters.completed && !filters.active) return true;

    // Фильтр по выполненным задачам
    if (
      filters.completed &&
      task.task_status_name.toLowerCase() === "выполнена"
    ) {
      return true;
    }

    // Фильтр по активным задачам
    if (filters.active && task.task_status_name.toLowerCase() !== "выполнена") {
      return true;
    }

    return false;
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain className="mb-10" />
      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black text-lg">
          Задачи мероприятия
        </label>
      </div>

      <div className="flex justify-start mb-4">
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
              onToggleDescription={toggleDescription}
              onTakeTask={takeTask}
              onDeleteTask={openConfirmDialog}
              event_id={event_id}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Удалить задачу?"
        description={
          selectedTask ? `Задача: ${selectedTask.task_name}` : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        confirmLabel="Да"
        cancelLabel="Нет"
      />

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
