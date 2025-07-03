"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TaskListItemCreator } from "@/lib/api/types/tasks-types";
import { RequiredFieldLabel } from "@/components/common/FormInput";

interface TaskFormProps {
  defaultValues?: Partial<TaskListItemCreator>;
  onSubmit: (data: TaskListItemCreator) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText: string;
}
export const TaskForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskListItemCreator>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="task_name">
          <RequiredFieldLabel text="Название задачи" />
        </Label>
        <Input
          id="task_name"
          {...register("task_name", { required: "Обязательное поле" })}
        />
        {errors.task_name && (
          <p className="text-sm text-red-500">{errors.task_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="task_description">Описание</Label>
        <Textarea id="task_description" {...register("task_description")} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="dark_green" disabled={isLoading}>
          {isLoading ? "Загрузка..." : submitButtonText}
        </Button>
        <Button
          type="button"
          variant="light_green"
          onClick={onCancel}
          disabled={isLoading}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};
