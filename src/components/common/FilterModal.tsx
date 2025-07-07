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

interface CategoryOption {
  id: string;
  label: string;
  options: FilterOption[];
  withSearch?: boolean;
}

interface BaseProps<T extends Record<string, boolean>> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters: T;
  onApply: (filters: T) => void;
  title?: string;
}

type FilterModalPropsSingle<T extends Record<string, boolean>> = BaseProps<T> & {
  mode?: "single";
  options: FilterOption[];
  withSearch?: boolean;
};

type FilterModalPropsMulti<T extends Record<string, boolean>> = BaseProps<T> & {
  mode: "multi";
  categories: CategoryOption[];
};

type FilterModalProps<T extends Record<string, boolean>> =
  | FilterModalPropsSingle<T>
  | FilterModalPropsMulti<T>;


/**
 * FilterModal — универсальный модальный компонент для выбора фильтров.
 *
 * Поддерживает два режима:
 * - "single": один список опций.
 * - "multi": список категорий с опциями внутри.
 *
 * @template T Тип фильтров: Record<string, boolean>
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Открыта ли модалка.
 * @param {(open: boolean) => void} props.onOpenChange - Изменяет состояние открытия.
 * @param {T} props.initialFilters - Начальные выбранные фильтры: ключ — id опции, значение — выбрана ли.
 * @param {(filters: T) => void} props.onApply - Вызывается при применении фильтров.
 * @param {string} [props.title] - Заголовок модалки. По умолчанию: "Фильтры".
 * @param {"single"} [props.mode] - Режим single: отображает один список фильтров.
 * @param {FilterOption[]} [props.options] - Список фильтров (для single).
 * @param {boolean} [props.withSearch] - Включить поиск (для single или категории).
 * @param {"multi"} [props.mode] - Режим multi: список категорий.
 * @param {CategoryOption[]} [props.categories] - Список категорий с опциями (для multi).
 *
 * @example
 * // Single mode
 * <FilterModal
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   initialFilters={{ draft: true, published: false }}
 *   onApply={(filters) => console.log(filters)}
 *   options={[
 *     { id: "draft", label: "Черновик" },
 *     { id: "published", label: "Опубликовано" },
 *   ]}
 *   withSearch={true}
 * />
 *
 * @example
 * // Multi mode
 * <FilterModal
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   initialFilters={{ draft: true, event1: true }}
 *   onApply={(filters) => console.log(filters)}
 *   mode="multi"
 *   categories={[
 *     {
 *       id: "status",
 *       label: "Статус",
 *       options: [
 *         { id: "draft", label: "Черновик" },
 *         { id: "published", label: "Опубликовано" },
 *       ],
 *     },
 *     {
 *       id: "event",
 *       label: "Мероприятие",
 *       withSearch: true,
 *       options: [
 *         { id: "event1", label: "Конференция A" },
 *         { id: "event2", label: "Семинар B" },
 *       ],
 *     },
 *   ]}
 * />
 */


export function FilterModal<T extends Record<string, boolean>>({
  isOpen,
  onOpenChange,
  initialFilters,
  onApply,
  title = "Фильтры",
  ...props
}: FilterModalProps<T>) {
  const [tempFilters, setTempFilters] = useState<T>(initialFilters);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setTempFilters(initialFilters);
    setActiveCategory(null); // Сбрасываем активную категорию при открытии
    setSearch(""); // Сбрасываем поиск при открытии
  }, [isOpen, initialFilters]);

  const handleFilterChange = (id: keyof T, checked: boolean) => {
    setTempFilters((prev) => ({ ...prev, [id]: checked }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempFilters(initialFilters);
    onOpenChange(false);
  };

  const currentCategory = props.mode === "multi" && activeCategory 
    ? props.categories.find(cat => cat.id === activeCategory)
    : null;

  const shouldShowSearch = currentCategory?.withSearch || 
    (props.mode !== "multi" && (props as FilterModalPropsSingle<T>).withSearch);

  const filteredOptions = () => {
    if (props.mode !== "multi") {
      const options = props.options;
      return shouldShowSearch
        ? options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
          )
        : options;
    }

    if (activeCategory) {
      const options = currentCategory?.options || [];
      return shouldShowSearch
        ? options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
          )
        : options;
    }

    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {shouldShowSearch && (
          <div className="mb-4">
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* multi mode */}
{props.mode === "multi" && (
  <>
    {activeCategory === null ? (
      <div className="space-y-4">
        {props.categories.map((category) => {
          const selectedInCategory = category.options.filter(
            (option) => tempFilters[option.id as keyof T]
          );

          return (
            <div key={category.id}>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>

              {selectedInCategory.length > 0 && (
                <div className="mt-1 text-sm text-gray-700">
                  {selectedInCategory.slice(0, 3).map((option, index) => (
                    <span key={option.id}>
                      {option.label}
                      {index < selectedInCategory.slice(0, 3).length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {selectedInCategory.length > 3 && "…"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      // это твоя часть с чекбоксами внутри активной категории, оставляешь без изменений
      <div className="space-y-4 max-h-40 overflow-y-auto">
        {filteredOptions().length > 0 ? (
          filteredOptions().map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={tempFilters[option.id as keyof T] ?? false}
                onCheckedChange={(checked) =>
                  handleFilterChange(option.id as keyof T, !!checked)
                }
                className="border-my-dark-green data-[state=checked]:bg-my-dark-green data-[state=checked]:border-my-dark-green"
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Ничего не найдено</p>
        )}
      </div>
    )}
  </>
)}


        {/* single mode */}
        {(!props.mode || props.mode === "single") && (
          <div className="space-y-4 max-h-40 overflow-y-auto">
            {filteredOptions().length > 0 ? (
              filteredOptions().map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={tempFilters[option.id as keyof T] ?? false}
                    onCheckedChange={(checked) =>
                      handleFilterChange(option.id as keyof T, !!checked)
                    }
                    className="border-my-dark-green data-[state=checked]:bg-my-dark-green data-[state=checked]:border-my-dark-green"
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Ничего не найдено</p>
            )}
          </div>
        )}

        <DialogFooter className="mt-4">
          {activeCategory === null ? (
            <>
              <Button variant="light_green" onClick={handleCancel}>
                Отмена
              </Button>
              <Button variant="dark_green" onClick={handleApply}>Применить</Button>
            </>
          ) : (
            <Button variant="dark_green" onClick={() => setActiveCategory(null)} className="w-full">
              Выбрать
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
