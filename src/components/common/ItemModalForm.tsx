"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RequiredFieldLabel } from "@/components/common/FormInput";
import { useGetEventParticipantsListQuery } from "@/lib/api/participants-api";
import { ParticipantSelect } from "@/components/common/ParticipantSelect";
import { DateSelect } from "@/components/common/DateSelect";
import { TimeSelect } from "@/components/common/TimeSelect";

const processFormData = (data: BaseItemFormValues) => {
  return {
    ...data,
    description: data.description === "" ? null : data.description,
  };
};

type BaseItemFormValues = {
  name: string;
  description?: string | null;
  responsible_login?: string | null;
  deadline_date?: string | null;
  deadline_time?: string | null;
};

interface ItemModalFormProps {
  defaultValues?: Partial<BaseItemFormValues>;
  onSubmit: (data: BaseItemFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventId?: number;
  showDateTimeFields?: boolean;
  formTitle?: string;
  nameLabel?: string;
  descriptionLabel?: string;
}

export const ItemModalForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText,
  eventDate,
  eventTime,
  eventId,
  showDateTimeFields = true,
  formTitle,
  nameLabel = "Название",
  descriptionLabel = "Описание",
}: ItemModalFormProps) => {
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
  } = useForm<BaseItemFormValues>({
    defaultValues: {
      deadline_date: showDateTimeFields ? eventDate || null : null,
      deadline_time: showDateTimeFields ? eventTime || null : null,
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
    <form
      onSubmit={handleSubmit((data) => onSubmit(processFormData(data)))}
      className="space-y-4"
    >
      {formTitle && <h3 className="text-lg font-bold mb-4">{formTitle}</h3>}

      <div>
<Label htmlFor="name">
  <RequiredFieldLabel text={nameLabel} />
</Label>
<Input
  id="name"
  {...register("name", {
    required: "Обязательное поле",
    maxLength: {
      value: 50,
      message: "Название не должно превышать 50 символов",
    },
  })}
  placeholder={"Не более 50 символов"}
  maxLength={50}
/>
{errors.name && (
  <p className="text-sm text-red-500">{errors.name.message}</p>
)}

      </div>

      <div>
        <Label htmlFor="description">{descriptionLabel}</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={`${descriptionLabel} не добавлено`}
          className="h-24 resize-none"
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

      {showDateTimeFields && (
        <>
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
              <p className="text-red-500 text-xs">
                {errors.deadline_date.message}
              </p>
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
              <p className="text-red-500 text-xs">
                {errors.deadline_time.message}
              </p>
            )}
          </div>
        </>
      )}

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
