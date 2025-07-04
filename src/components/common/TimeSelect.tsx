"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  error?: boolean;
}

/**
 * Компонент для выбора времени
 *
 * @description
 * Компонент `TimeSelect` предоставляет:
 * - Нативный input типа time с кастомным стилем
 * - Иконку часов
 * - Шаг выбора времени в 60 минут (только целые часы)
 * - Валидацию (подсветку ошибки)
 * - Кастомные стили для состояний
 *
 * @param props - Свойства компонента
 * @param props.value - Текущее значение времени в формате "HH:mm"
 * @param props.onChange - Callback, вызывается при изменении времени
 * @param props.className - Дополнительные стили Tailwind
 * @param props.error - Флаг ошибки (подсветка красной рамкой)
 *
 * @example
 * // Базовое использование
 * <TimeSelect onChange={(time) => console.log(time)} />
 *
 * @example
 * // С предустановленным временем
 * <TimeSelect value="14:00" onChange={handleTimeChange} />
 *
 * @example
 * // С ошибкой валидации
 * <TimeSelect error={true} />
 */
export function TimeSelect({
  value,
  onChange,
  className,
  error = false,
}: TimeSelectProps) {
  return (
    <div className="relative flex items-center">
      <input
        type="time"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex-1 h-10 rounded-md border border-input bg-white px-3 py-2 text-sm",
          !value ? "text-muted-foreground" : "text-black",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          "[&::-webkit-calendar-picker-indicator]:opacity-0",
          className
        )}
        step="60"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Clock
          className={cn(
            "h-4 w-4",
            !value ? "text-muted-foreground" : "text-black"
          )}
        />
      </div>
    </div>
  );
}
