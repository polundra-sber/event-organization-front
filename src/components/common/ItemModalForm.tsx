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

/**
 * Универсальная форма для создания/редактирования элементов мероприятия
 *
 * @description
 * Компонент `ItemModalForm` предоставляет универсальную форму для работы с:
 * - Задачами мероприятия (с полями даты и времени)
 * - Вещами мероприятия (без полей даты и времени)
 *
 * Основные возможности:
 * - Поддержка создания и редактирования элементов
 * - Валидация обязательных полей
 * - Интеграция с участниками мероприятия
 * - Гибкое управление отображением полей даты/времени
 * - Кастомизация текста кнопки отправки
 * - Поддержка состояния загрузки
 *
 * @param props - Свойства формы
 * @param props.defaultValues - Начальные значения формы
 * @param props.onSubmit - Callback при отправке формы
 * @param props.onCancel - Callback при отмене
 * @param props.isLoading - Флаг состояния загрузки
 * @param props.submitButtonText - Текст кнопки отправки
 * @param props.eventDate - Дата мероприятия (по умолчанию для даты выполнения)
 * @param props.eventTime - Время мероприятия (по умолчанию для времени выполнения)
 * @param props.eventId - ID мероприятия для загрузки участников
 * @param props.showDateTimeFields - Флаг отображения полей даты/времени (по умолчанию true)
 * @param props.formTitle - Заголовок формы (опционально)
 *
 * @example
 * // Форма для задачи (с датой/временем)
 * <ItemModalForm
 *   onSubmit={handleTaskSubmit}
 *   onCancel={closeModal}
 *   isLoading={isSubmitting}
 *   submitButtonText="Сохранить"
 *   eventDate={eventDate}
 *   eventTime={eventTime}
 *   eventId={eventId}
 *   formTitle="Редактировать задачу"
 * />
 *
 * @example
 * // Форма для вещи (без даты/времени)
 * <ItemModalForm
 *   onSubmit={handleItemSubmit}
 *   onCancel={closeModal}
 *   isLoading={isSubmitting}
 *   submitButtonText="Создать"
 *   eventId={eventId}
 *   showDateTimeFields={false}
 *   formTitle="Добавить вещь"
 * />
 */

interface ItemFormProps {
  defaultValues?: Partial<TaskListItemCreator>;
  onSubmit: (data: TaskListItemCreator) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventId?: number;
  showDateTimeFields?: boolean;
  formTitle?: string;
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
}: ItemFormProps) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formTitle && <h3 className="text-lg font-bold mb-4">{formTitle}</h3>}

      <div>
        <Label htmlFor="task_name">
          <RequiredFieldLabel text="Название" />
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
