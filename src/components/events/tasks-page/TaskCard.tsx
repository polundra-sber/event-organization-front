import {
  TaskListItem,
  TaskListItemResponsible,
} from "@/lib/api/types/tasks-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";

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
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;
  const isCompleted = task.task_status_name.toLowerCase() === "выполнена";
  const isTaskAvailable =
    !task.responsible_user || task.responsible_user === "Не назначен";

  // Состояния для диалогов и загрузки
  const [isTakeDialogOpen, setIsTakeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {task.task_name}
          </CardTitle>
          {canEditDelete && isEventActive && (
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
        <CardDescription className="text-black">
          Срок: {task.deadline_date} {task.deadline_time || ""}
        </CardDescription>
        <p className="text-sm mt-1">
          Статус:{" "}
          <span className={isCompleted ? "text-green-600" : "text-blue-600"}>
            {task.task_status_name}
          </span>
        </p>
        <p className="text-sm mt-1">
          Ответственный: {task.responsible_user || "Не назначен"}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between items-center relative flex-wrap gap-4">
        <div className="relative">
          {task.task_description && (
            <button
              onClick={() => onToggleDescription(task.task_id)}
              className="flex items-center text-sm text-gray-700 hover:text-gray-900"
            >
              <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2">
                {isOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
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

        {/* Показываем кнопки только для активных мероприятий */}
        {isEventActive && (
          <div className="flex gap-2 ml-auto">
            {canEditDelete && (
              <>
                <Button
                  variant="yellow_green"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  Удалить
                </Button>

                <ConfirmationDialog
                  isOpen={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                  title="Удалить задачу?"
                  description={`Вы уверены, что хотите удалить задачу "${task.task_name}"?`}
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
                >
                  Взять задачу
                </Button>

                <ConfirmationDialog
                  isOpen={isTakeDialogOpen}
                  onOpenChange={setIsTakeDialogOpen}
                  title="Взять задачу?"
                  description={`Вы уверены, что хотите взять задачу "${task.task_name}"?`}
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
  );
};
