"use client";

import { useState } from "react";
import {
  useGetMyTasksListQuery,
  useDenyTaskInMyTasksListMutation,
  useMarkTaskCompletedInMyTasksListMutation,
} from "@/lib/api/my-tasks-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ButtonToMain } from "../common/ButtonToMain";

export const MyTasksPageContent = () => {
  const { data, isLoading, isError } = useGetMyTasksListQuery();
  const [denyTask] = useDenyTaskInMyTasksListMutation();
  const [markTaskCompleted] = useMarkTaskCompletedInMyTasksListMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>({
    done: false,
    in_progress: false,
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    task_id: number;
    event_id: number;
    task_name: string;
  } | null>(null);

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const openConfirmDialog = (task: {
    task_id: number;
    event_id: number;
    task_name: string;
  }) => {
    setSelectedTask(task);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      try {
        await denyTask({
          event_id: selectedTask.event_id,
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
    // Проверяем фильтры по статусу
    const statusFiltersActive = filters.done || filters.in_progress;
    const statusMatch =
      !statusFiltersActive || // если ни один статус не выбран - показываем все
      (filters.done && task.task_status_name === "выполнена") ||
      (filters.in_progress && task.task_status_name !== "выполнена");

    // Проверяем фильтры по мероприятиям
    const eventFiltersActive = Object.keys(filters).some(key => 
      key.startsWith('event_') && filters[key]
    );
    const eventMatch =
      !eventFiltersActive || // если ни одно мероприятие не выбрано - показываем все
      Object.keys(filters).some(
        key => key.startsWith('event_') && 
        filters[key] && 
        key === `event_${task.event_id}`
      );

    return statusMatch && eventMatch;
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain className="mb-10"/>
      <div className="flex items-center justify-center bg-my-light-orange px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black text-lg">
          Мои задачи
        </label>
      </div>

      <div className="flex justify-start mb-4">
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет задач</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isOpen = openedDescriptionId === task.task_id;

            return (
              <Card key={task.task_id}>
                <CardHeader>
                  <CardTitle>{task.event_name}</CardTitle>
                  <CardDescription className="text-black">
                    {task.task_name}
                  </CardDescription>
                  <CardDescription className="text-black">
                    Срок завершения задачи: {task.deadline_date} {task.deadline_time || ""}
                  </CardDescription>
                  <p className="text-sm mt-1">
                    Статус: {task.task_status_name}
                  </p>
                </CardHeader>

                <CardContent className="flex justify-between items-center relative flex-wrap gap-4">
                  <div className="relative">
                    {task.task_description && (
                      <button
                        onClick={() => toggleDescription(task.task_id)}
                        className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2">
                          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                        Описание
                      </button>
                    )}

                    {isOpen && (
                      <div className="absolute left-0 mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
                        <p className="text-sm text-gray-600">
                          {task.task_description || "Описание не добавлено"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-auto">
                    {task.task_status_name !== "выполнена" && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await markTaskCompleted({
                              event_id: task.event_id,
                              task_id: task.task_id,
                            }).unwrap();
                            toast.success("Задача отмечена как выполненная");
                          } catch {
                            toast.error("Ошибка при изменении статуса");
                          }
                        }}
                      >
                        Выполнено
                      </Button>
                    )}
                    {task.task_status_name !== "выполнена" && (
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => openConfirmDialog(task)}
                      >
                        Отказаться
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Удалить задачу?"
        description={selectedTask ? `Задача: ${selectedTask.task_name}` : undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        confirmLabel="Да"
        cancelLabel="Нет"
      />

      <FilterModal
        mode="multi"
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={filters}
        onApply={setFilters}
        categories={[
          {
            id: "status",
            label: "Статус",
            options: [
              { id: "done", label: "Выполненные" },
              { id: "in_progress", label: "В процессе" },
            ],
          },
          {
            id: "event",
            label: "Мероприятие",
            withSearch: true,
            options: Array.from(
              new Map(
                tasks.map(task => [`event_${task.event_id}`, {
                  id: `event_${task.event_id}`,
                  label: task.event_name,
                }])
              ).values()
            ),
          },
        ]}
      />
    </div>
  );
};