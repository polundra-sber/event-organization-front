import { TaskListItem } from "@/lib/api/types/task-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskCardProps {
  task: TaskListItem;
  isOpen: boolean;
  event_id: number;
  onToggleDescription: (id: number) => void;
  onTakeTask: any;
  onDeleteTask: (task: { task_id: number; task_name: string }) => void;
}

export const TaskCard = ({
  task,
  isOpen,
  event_id,
  onToggleDescription,
  onTakeTask,
  onDeleteTask,
}: TaskCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.task_name}</CardTitle>
        <CardDescription className="text-black">
          Срок: {task.deadline_date} {task.deadline_time || ""}
        </CardDescription>
        <p className="text-sm mt-1">Статус: {task.task_status_name}</p>
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

        <div className="flex gap-2 ml-auto">
          {task.task_status_name !== "выполнена" && (
            <Button
              variant="light_green"
              size="sm"
              onClick={() => onTakeTask({ event_id, task_id: task.task_id })}
            >
              Взять задачу
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              onDeleteTask({
                task_id: task.task_id,
                task_name: task.task_name,
              })
            }
          >
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
