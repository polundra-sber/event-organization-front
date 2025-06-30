"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

type SelectButtonProps = {
  isSelected?: boolean;
  onSelect?: () => void;
  href?: string;
  className?: string;
  label?: string;
};

/**
 * Кнопка для выбора элемента (например, мероприятия)
 *
 * @description
 * Компонент `SelectButton` отображает кнопку с возможностью:
 * - Переключаться между состояниями: "Выбрать" → "✓ Выбрано"
 * - Быть ссылкой (`href`) или обычной кнопкой
 * - Вызывать callback при изменении состояния
 *
 * @param props - Свойства кнопки
 * @param props.isSelected - Начальное состояние выбора (по умолчанию false)
 * @param props.onSelect - Callback, вызывается при изменении состояния
 * @param props.href - Если указан, кнопка становится ссылкой
 * @param props.className - Дополнительные стили Tailwind
 * @param props.label - Текст кнопки (по умолчанию "Выбрать")
 *
 * @example
 * // Простой вариант: кнопка без ссылки
 * <SelectButton label="Выбрать мероприятие" />
 *
 * @example
 * // Кнопка-ссылка
 * <SelectButton href="/events/1" label="Выбрать" />
 *
 * @example
 * // С обработчиком выбора
 * <SelectButton
 *   isSelected={selectedEvents.includes(event.id)}
 *   onSelect={() => toggleSelection(event.id)}
 *   label="Выбрать"
 * />
 */
export const SelectButton = ({
  isSelected = false,
  onSelect,
  href,
  className,
  label = "Выбрать",
}: SelectButtonProps) => {
  const [selected, setSelected] = useState(isSelected);

  const handleClick = () => {
    const newState = !selected;
    setSelected(newState);
    if (onSelect) {
      onSelect();
    }
  };

  return href ? (
    <Button
      variant={selected ? "secondary" : "default"}
      size="sm"
      asChild
      className={className}
      onClick={handleClick}
    >
      <Link href={href}>
        {selected ? "✓ Выбрано" : label}
      </Link>
    </Button>
  ) : (
    <Button
      variant={selected ? "secondary" : "default"}
      size="sm"
      className={className}
      onClick={handleClick}
    >
      {selected ? "✓ Выбрано" : label}
    </Button>
  );
};