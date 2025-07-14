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
    setActiveCategory(null);
    setSearch("");
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

  // Функция для сокращения длинных названий в выбранных фильтрах
  const truncateLabel = (label: string, maxLength: number = 20) => {
    if (label.length <= maxLength) return label;
    return `${label.substring(0, maxLength)}...`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
                    <div key={category.id} className="space-y-1">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="truncate">{category.label}</span>
                      </Button>

                      {selectedInCategory.length > 0 && (
                        <div className="text-sm text-gray-700 line-clamp-1">
                          {selectedInCategory.map((option, index) => (
                            <span key={option.id}>
                              {truncateLabel(option.label, 15)}
                              {index < selectedInCategory.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {filteredOptions().length > 0 ? (
                  filteredOptions().map((option) => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={tempFilters[option.id as keyof T] ?? false}
                        onCheckedChange={(checked) =>
                          handleFilterChange(option.id as keyof T, !!checked)
                        }
                        className="mt-1 border-my-dark-green data-[state=checked]:bg-my-dark-green data-[state=checked]:border-my-dark-green"
                      />
                      <Label htmlFor={option.id} className="whitespace-normal break-words">
                        {option.label}
                      </Label>
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
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {filteredOptions().length > 0 ? (
              filteredOptions().map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={tempFilters[option.id as keyof T] ?? false}
                    onCheckedChange={(checked) =>
                      handleFilterChange(option.id as keyof T, !!checked)
                    }
                    className="mt-1 border-my-dark-green data-[state=checked]:bg-my-dark-green data-[state=checked]:border-my-dark-green"
                  />
                  <Label htmlFor={option.id} className="whitespace-normal break-words">
                    {option.label}
                  </Label>
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
              <Button variant="yellow_green" onClick={handleCancel}>
                Отмена
              </Button>
              <Button variant="dark_green" onClick={handleApply}>Применить</Button>
            </>
          ) : (
            <Button variant="dark_green" onClick={() => setActiveCategory(null)} className="w-full">
              Назад
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}