"use client";

import {
  TaskListItem,
  TaskListItemResponsible,
  TaskListItemEditor,
} from "@/lib/api/types/tasks-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { useEditTaskInTasksListMutation } from "@/lib/api/tasks-api";

interface TaskCardProps {
  task: TaskListItem;
  isOpen: boolean;
  event_id: number;
  userRole: EventRole;
  eventStatus: EventStatus;
  onToggleDescription: (id: number) => void;
  onTakeTask: (params: {
    event_id: number;
    task_id: number;
  }) => Promise<TaskListItemResponsible>;
  onDeleteTask: (params: {
    event_id: number;
    task_id: number;
  }) => Promise<void>;
}

export const TaskCard = ({
  task,
  isOpen,
  event_id,
  userRole,
  eventStatus,
  onToggleDescription,
  onTakeTask,
  onDeleteTask,
}: TaskCardProps) => {
  const [editTask] = useEditTaskInTasksListMutation();
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;
  const isCompleted = task.task_status_name.toLowerCase() === "выполнена";
  const isTaskAvailable = !task.responsible_login;

  // Состояния для диалогов и загрузки
  const [isTakeDialogOpen, setIsTakeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Форматирование даты для отображения
  const formatDisplayDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    } catch {
      return dateString;
    }
  };

  const displayDate = formatDisplayDate(task.deadline_date);
  const displayTime = task.deadline_time || "";

  const handleTakeTask = async () => {
    setIsTaking(true);
    try {
      const result = await onTakeTask({ event_id, task_id: task.task_id });
      toast.success(`Задача "${task.task_name}" успешно взята`);
      return result;
    } catch (error) {
      toast.error("Не удалось взять задачу");
      throw error;
    } finally {
      setIsTaking(false);
      setIsTakeDialogOpen(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      await onDeleteTask({
        event_id,
        task_id: task.task_id,
      });
      toast.success(`Задача "${task.task_name}" удалена`);
    } catch (error) {
      toast.error("Не удалось удалить задачу");
      throw error;
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditTask = async (data: TaskListItemEditor) => {
    try {
      await editTask({
        event_id,
        task_id: task.task_id,
        taskData: {
          ...data,
          responsible_login: data.responsible_login || null,
        },
      }).unwrap();
      toast.success("Задача успешно обновлена");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка при обновлении задачи");
    }
  };

  return (
    <>
      <Card className="w-full max-w-full min-w-0">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2 min-w-0">
            <CardTitle className="text-lg font-semibold break-words overflow-hidden text-ellipsis min-w-0">
              {task.task_name}
            </CardTitle>
            {canEditDelete && isEventActive && (
              <button
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                onClick={() => setIsEditing(true)}
                aria-label="Редактировать"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-black break-words min-w-0">
            Срок: {displayDate} {displayTime}
          </p>
          <p className="text-sm mt-1 break-words min-w-0">
            Статус:{" "}
            <span className={isCompleted ? "text-green-600" : "text-blue-600"}>
              {task.task_status_name}
            </span>
          </p>
          <p className="text-sm mt-1 break-words min-w-0">
            Ответственный:{" "}
            {task.responsible_login
              ? `${task.responsible_name || ""} ${
                  task.responsible_surname || ""
                }`.trim()
              : "Не назначен"}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="relative w-full min-w-0">
            {task.task_description && (
              <button
                onClick={() => onToggleDescription(task.task_id)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 w-full min-w-0"
              >
                <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </span>
                <span className="text-left break-words overflow-hidden text-ellipsis min-w-0">
                  Описание
                </span>
              </button>
            )}

            {isOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
                <p className="text-sm text-gray-600 break-words whitespace-pre-line">
                  {task.task_description || "Описание не добавлено"}
                </p>
              </div>
            )}
          </div>

          {isEventActive && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end min-w-0">
              {canEditDelete && (
                <>
                  <Button
                    variant="yellow_green"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                    className="min-w-0"
                  >
                    Удалить
                  </Button>

                  <ConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Удалить задачу?"
                    description={`Вы уверены, что хотите удалить "${task.task_name}"?`}
                    onConfirm={handleDeleteTask}
                    confirmLabel={isDeleting ? "Удаление..." : "Удалить"}
                    cancelLabel="Отмена"
                  />
                </>
              )}

              {!isCompleted && isTaskAvailable && (
                <>
                  <Button
                    variant="dark_green"
                    size="sm"
                    onClick={() => setIsTakeDialogOpen(true)}
                    disabled={isTaking}
                    className="min-w-0"
                  >
                    Взять задачу
                  </Button>

                  <ConfirmationDialog
                    isOpen={isTakeDialogOpen}
                    onOpenChange={setIsTakeDialogOpen}
                    title="Взять задачу?"
                    description={`Вы уверены, что хотите взять "${task.task_name}"?`}
                    onConfirm={handleTakeTask}
                    confirmLabel={isTaking ? "Принятие..." : "Взять"}
                    cancelLabel="Отмена"
                  />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <ItemModalForm
              defaultValues={{
                name: task.task_name,
                description: task.task_description || null,
                deadline_date: task.deadline_date,
                deadline_time: task.deadline_time || null,
                responsible_login: task.responsible_login || null,
              }}
              onSubmit={(data) =>
                handleEditTask({
                  task_name: data.name,
                  task_description: data.description,
                  responsible_login: data.responsible_login,
                  deadline_date: data.deadline_date,
                  deadline_time: data.deadline_time,
                })
              }
              onCancel={() => setIsEditing(false)}
              isLoading={false}
              submitButtonText="Сохранить"
              eventId={event_id}
              showDateTimeFields={true}
              formTitle="Редактировать задачу"
              nameLabel="Название задачи"
              descriptionLabel="Описание задачи"
            />
          </div>
        </div>
      )}
    </>
  );
};