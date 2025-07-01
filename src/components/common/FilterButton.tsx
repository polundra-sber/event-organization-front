"use client";

import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  onClick: () => void;
  label?: string;
}

/**
 * Кнопка для открытия фильтров
 *
 * @description
 * Компонент `FilterButton` отображает кнопку с иконкой фильтра и текстом:
 * - По умолчанию отображается текст "Фильтры" и иконка в виде воронки
 * - Вызывает переданный callback при клике
 * - Имеет стиль secondary и небольшой размер (sm)
 * - Поддерживает кастомизацию текста кнопки
 *
 * @param props - Свойства кнопки
 * @param props.onClick - Callback, вызываемый при клике на кнопку
 * @param props.label - Текст кнопки (по умолчанию "Фильтры")
 *
 * @example
 * // Простой вариант
 * <FilterButton onClick={() => setIsOpen(true)} />
 *
 * @example
 * // С кастомным текстом
 * <FilterButton
 *   onClick={openFilters}
 *   label="Настроить фильтры"
 * />
 */
export const FilterButton = ({
  onClick,
  label = "Фильтры",
}: FilterButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="flex items-center gap-2"
      onClick={onClick}
    >
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
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      {label}
    </Button>
  );
};
