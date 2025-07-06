"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TaskListItemCreator } from "@/lib/api/types/tasks-types";
import { RequiredFieldLabel } from "@/components/common/FormInput";
import { useGetEventParticipantsListQuery } from "@/lib/api/participants-api";
import { ParticipantSelect } from "@/components/common/ParticipantSelect";
import { DateSelect } from "@/components/common/DateSelect";
import { TimeSelect } from "@/components/common/TimeSelect";

interface TaskFormProps {
  defaultValues?: Partial<TaskListItemCreator>;
  onSubmit: (data: TaskListItemCreator) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventId?: number;
}

export const TaskForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText,
  eventDate,
  eventTime,
  eventId,
}: TaskFormProps) => {
  const { data: participants = [] } = useGetEventParticipantsListQuery(
    eventId || 0,
    { skip: !eventId }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskListItemCreator>({
    defaultValues: {
      deadline_date: eventDate || null,
      deadline_time: eventTime || null,
      responsible_login: null,
      ...defaultValues,
    },
  });

  const deadline_date = watch("deadline_date");
  const deadline_time = watch("deadline_time");
  const responsible_login = watch("responsible_login");

  const handleDateChange = (date: string | null) => {
    setValue("deadline_date", date, { shouldValidate: true });
  };

  const handleTimeChange = (time: string | null) => {
    setValue("deadline_time", time, { shouldValidate: true });
  };

  const handleResponsibleChange = (login: string | null) => {
    setValue("responsible_login", login, { shouldValidate: true });
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
        <Textarea
          id="task_description"
          {...register("task_description")}
          placeholder="Описание не добавлено"
        />
      </div>

      <div>
        <Label>Ответственный</Label>
        <ParticipantSelect
          participants={participants}
          value={responsible_login}
          onChange={handleResponsibleChange}
          placeholder="Не назначен"
        />
      </div>

      <div className="rounded-xl space-y-1">
        <Label>
          <RequiredFieldLabel text="Дата выполнения" />
        </Label>
        <DateSelect
          value={deadline_date}
          onChange={handleDateChange}
          error={!!errors.deadline_date}
        />
        {errors.deadline_date && (
          <p className="text-red-500 text-xs">{errors.deadline_date.message}</p>
        )}
      </div>

      <div className="rounded-xl space-y-1">
        <Label>Время выполнения</Label>
        <TimeSelect
          value={deadline_time}
          onChange={handleTimeChange}
          error={!!errors.deadline_time}
        />
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
