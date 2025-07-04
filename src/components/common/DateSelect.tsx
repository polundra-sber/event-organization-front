"use client";

import { Button } from "@/components/ui/button";
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

interface DateSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
  fromDate?: Date;
}

/**
 * Компонент для выбора даты с календарем
 *
 * @description
 * Компонент `DateSelect` предоставляет:
 * - Попап с календарем для выбора даты
 * - Локализацию на русский язык
 * - Возможность установки минимальной доступной даты
 * - Валидацию (подсветку ошибки)
 * - Кастомный placeholder
 *
 * @param props - Свойства компонента
 * @param props.value - Текущее значение даты в формате "yyyy-MM-dd"
 * @param props.onChange - Callback, вызывается при изменении даты
 * @param props.className - Дополнительные стили Tailwind
 * @param props.placeholder - Текст placeholder (по умолчанию "Выберите дату")
 * @param props.error - Флаг ошибки (подсветка красной рамкой)
 * @param props.fromDate - Минимальная доступная дата (по умолчанию текущая дата)
 *
 * @example
 * // Базовое использование
 * <DateSelect onChange={(date) => console.log(date)} />
 *
 * @example
 * // С предустановленной датой
 * <DateSelect value="2023-12-31" onChange={handleDateChange} />
 *
 * @example
 * // С ограничением по минимальной дате
 * <DateSelect fromDate={new Date(2023, 0, 1)} />
 */
export function DateSelect({
  value,
  onChange,
  className,
  placeholder = "Выберите дату",
  error = false,
  fromDate = new Date(),
}: DateSelectProps) {
  const dateValue = value
    ? new Date(value.split(".").reverse().join("-"))
    : undefined;

  const handleDateSelect = (date?: Date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 bg-white",
            !value ? "text-muted-foreground" : "text-black",
            error && "border-red-500",
            className
          )}
        >
          {value ? (
            format(new Date(value.split(".").reverse().join("-")), "PPP", {
              locale: ru,
            })
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          initialFocus
          locale={ru}
          fromDate={fromDate}
          className="bg-white"
        />
      </PopoverContent>
    </Popover>
  );
}
