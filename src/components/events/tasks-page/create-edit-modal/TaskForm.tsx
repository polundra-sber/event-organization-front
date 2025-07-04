"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TaskListItemCreator } from "@/lib/api/types/tasks-types";
import { RequiredFieldLabel } from "@/components/common/FormInput";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface TaskFormProps {
  defaultValues?: Partial<TaskListItemCreator>;
  onSubmit: (data: TaskListItemCreator) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText: string;
  eventDate?: string; // Дата мероприятия
  eventTime?: string; // Время мероприятия
}

export const TaskForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText,
  eventDate,
  eventTime,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskListItemCreator>({
    defaultValues: {
      deadline_date: eventDate, // Устанавливаем дату мероприятия по умолчанию
      deadline_time: eventTime, // Устанавливаем время мероприятия по умолчанию
      ...defaultValues,
    },
  });

  const deadline_date = watch("deadline_date");
  const deadline_time = watch("deadline_time");

  const handleDateSelect = (date?: Date) => {
    if (date) {
      const formattedDate = format(date, "dd.MM.yyyy");
      setValue("deadline_date", formattedDate, { shouldValidate: true });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("deadline_time", e.target.value, { shouldValidate: true });
  };

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

      {/* Дата выполнения (обязательная) */}
      <div className="rounded-xl space-y-1">
        <Label>
          <RequiredFieldLabel text="Дата выполнения" />
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 bg-white",
                !deadline_date ? "text-muted-foreground" : "text-black",
                errors.deadline_date && "border-red-500"
              )}
            >
              {deadline_date ? (
                format(
                  new Date(deadline_date.split(".").reverse().join("-")),
                  "PPP",
                  { locale: ru }
                )
              ) : (
                <span>Выберите дату</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                deadline_date
                  ? new Date(deadline_date.split(".").reverse().join("-"))
                  : undefined
              }
              onSelect={handleDateSelect}
              initialFocus
              locale={ru}
              fromDate={new Date()} // Запрещаем выбирать даты раньше сегодня
              className="bg-white"
            />
          </PopoverContent>
        </Popover>
        {errors.deadline_date && (
          <p className="text-red-500 text-xs">{errors.deadline_date.message}</p>
        )}
      </div>

      {/* Время выполнения (необязательное) */}
      <div className="rounded-xl space-y-1">
        <Label>Время выполнения</Label>
        <div className="relative flex items-center">
          <input
            type="time"
            value={deadline_time || ""}
            onChange={handleTimeChange}
            className={cn(
              "flex-1 h-10 rounded-md border border-input bg-white px-3 py-2 text-sm",
              !deadline_time ? "text-muted-foreground" : "text-black",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.deadline_time && "border-red-500",
              "[&::-webkit-calendar-picker-indicator]:opacity-0"
            )}
            step="60"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
              className={
                !deadline_time ? "text-muted-foreground" : "text-black"
              }
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
        {errors.deadline_time && (
          <p className="text-red-500 text-xs">{errors.deadline_time.message}</p>
        )}
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
