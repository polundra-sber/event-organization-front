"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterModalProps<T extends Record<string, boolean>> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters: T;
  onApply: (filters: T) => void;
  options: FilterOption[];
  title?: string;
  withSearch?: boolean; 
}

/**
 * Модальное окно для выбора фильтров с чекбоксами
 *
 * @description
 * Компонент `FilterModal` предоставляет:
 * - Модальное окно с настраиваемым заголовком
 * - Список фильтров в виде чекбоксов
 * - Кнопки "Отмена" и "Применить"
 * - Сохранение временного состояния фильтров перед применением
 * - Поддержку generic типа для фильтров
 *
 * @typeParam T - Объект типа Record<string, boolean>, где ключи - ID фильтров, значения - их состояние
 *
 * @param props - Свойства компонента
 * @param props.isOpen - Флаг видимости модального окна
 * @param props.onOpenChange - Callback для изменения видимости окна
 * @param props.initialFilters - Начальные значения фильтров
 * @param props.onApply - Callback, вызываемый при применении фильтров
 * @param props.options - Массив вариантов фильтров
 * @param props.title - Заголовок модального окна (по умолчанию "Фильтры")
 *
 * @example
 * // Базовое использование
 * <FilterModal
 *   isOpen={isFilterOpen}
 *   onOpenChange={setIsFilterOpen}
 *   initialFilters={{ all: true, completed: false }}
 *   onApply={(filters) => setActiveFilters(filters)}
 *   options={[
 *     { id: "all", label: "Все задачи" },
 *     { id: "completed", label: "Только выполненные" }
 *   ]}
 * />
 *
 * @example
 * // С кастомным заголовком
 * <FilterModal
 *   title="Фильтры задач"
 *   // остальные пропсы...
 * />
 */
export function FilterModal<T extends Record<string, boolean>>({
  isOpen,
  onOpenChange,
  initialFilters,
  onApply,
  options,
  title = "Фильтры",
  withSearch = false,
}: FilterModalProps<T>) {
 const [tempFilters, setTempFilters] = useState<T>(initialFilters);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTempFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (id: keyof T, checked: boolean) => {
    setTempFilters((prev) => ({ ...prev, [id]: checked }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    onOpenChange(false);
  };

  const filteredOptions = withSearch
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {withSearch && (
          <div className="mb-4">
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-4 max-h-30 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={tempFilters[option.id as keyof T] ?? false}
                  onCheckedChange={(checked) =>
                    handleFilterChange(option.id as keyof T, !!checked)
                  }
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Ничего не найдено</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleApply}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}