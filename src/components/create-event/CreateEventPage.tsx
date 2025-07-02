"use client";

import { Button } from "@/components/ui/button";
import { useCreateEventMutation } from "@/lib/api/events-api";
import { ButtonToMain } from "@/components/common/ButtonToMain";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput, RequiredFieldLabel } from "./FormInput";
import {
  validateEventDate,
  validateEventTime,
} from "@/lib/validation/event-validation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateEventPage() {
  const router = useRouter();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_date: "",
    event_time: "",
    location: "",
    chat_link: "",
  });

  const [errors, setErrors] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const formattedDate = format(date, "dd/MM/yyyy");
    setFormData((prev) => ({
      ...prev,
      event_date: formattedDate,
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      event_time: value,
    }));

    const timeValidation = validateEventTime(value);
    if (!timeValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        event_time: timeValidation.error || "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, event_time: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!formData.event_name.trim()) {
      setErrors((prev) => ({
        ...prev,
        event_name: "Введите название мероприятия",
      }));
      valid = false;
    }

    const dateValidation = validateEventDate(formData.event_date);
    if (!dateValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        event_date: dateValidation.error || "",
      }));
      valid = false;
    }

    setErrors((prev) => ({ ...prev, event_time: "" }));

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await createEvent({
        event_name: formData.event_name,
        event_description: formData.event_description,
        event_date: formData.event_date.split("/").reverse().join("-"),
        event_time: formData.event_time,
        location: formData.location,
        chat_link: formData.chat_link,
      }).unwrap();

      router.push(`/events`);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="p-4 pt-10 min-h-screen bg-gray-50">
      <div className="mb-8">
        <ButtonToMain />
      </div>

      <header className="flex items-center justify-between mb-6 relative">
        <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          Создание мероприятия
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="event_name"
          label="Название мероприятия"
          placeholder="Введите название"
          value={formData.event_name}
          onChange={handleChange}
          error={errors.event_name}
          required
        />

        <FormInput
          name="event_description"
          label="Описание мероприятия"
          placeholder="Введите описание"
          value={formData.event_description}
          onChange={handleChange}
        />

        {/* Дата мероприятия (обязательная) */}
        <div className="bg-pink-100 p-4 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">
            <RequiredFieldLabel text="Дата мероприятия" />
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 bg-white dark:bg-white",
                  !formData.event_date
                    ? "text-muted-foreground"
                    : "text-black dark:text-black",
                  errors.event_date && "border-red-500"
                )}
              >
                {formData.event_date ? (
                  format(
                    new Date(
                      formData.event_date.split("/").reverse().join("-")
                    ),
                    "PPP",
                    { locale: ru }
                  )
                ) : (
                  <span>Выберите дату</span>
                )}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  formData.event_date
                    ? new Date(
                        formData.event_date.split("/").reverse().join("-")
                      )
                    : undefined
                }
                onSelect={handleDateSelect}
                initialFocus
                locale={ru}
                fromDate={new Date()}
                className="bg-white dark:bg-white"
              />
            </PopoverContent>
          </Popover>
          {errors.event_date && (
            <p className="text-red-600 text-xs">{errors.event_date}</p>
          )}
        </div>

        {/* Время мероприятия (необязательное) */}
        <div className="bg-pink-100 p-4 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Время начала</label>
          <div className="relative flex items-center">
            <input
              type="time"
              value={formData.event_time}
              onChange={handleTimeChange}
              className={cn(
                "flex-1 h-10 rounded-md border border-input bg-white dark:bg-white px-3 py-2 text-sm",
                !formData.event_time
                  ? "text-muted-foreground"
                  : "text-black dark:text-black",
                "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.event_time && "border-red-500",
                "[&::-webkit-calendar-picker-indicator]:opacity-0" // Скрываем стандартную иконку
              )}
              step="60"
            />
            {/* Кастомная иконка часов (некликабельная) */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 pointer-events-none ml-[4.5rem]">
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
                  !formData.event_time
                    ? "text-muted-foreground"
                    : "text-black dark:text-black"
                }
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          {errors.event_time && (
            <p className="text-red-600 text-xs">{errors.event_time}</p>
          )}
        </div>

        <FormInput
          name="location"
          label="Место проведения"
          placeholder="Введите место"
          value={formData.location}
          onChange={handleChange}
        />

        <FormInput
          name="chat_link"
          label="Чат мероприятия"
          placeholder="Вставьте ссылку"
          value={formData.chat_link}
          onChange={handleChange}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="dark_pink"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Создание..." : "Создать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
