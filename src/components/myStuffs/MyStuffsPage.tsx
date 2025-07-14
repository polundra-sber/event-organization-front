"use client";

import { useState } from "react";
import { ButtonToMain } from "../common/ButtonToMain";
import { Button } from "@/components/ui/button";
import {
  useGetMyStuffsListQuery,
  useDenyStuffInMyStuffsListMutation,
} from "@/lib/api/my-stuffs-api";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FilterButton } from "@/components/common/FilterButton";
import { FilterModal } from "@/components/common/FilterModal";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Loader } from "../common/Loader";

export const MyStuffsPageContent = () => {
  const { data = [], isLoading, isError } = useGetMyStuffsListQuery();
  const [denyStuff] = useDenyStuffInMyStuffsListMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStuff, setSelectedStuff] = useState<{
    stuff_id: number;
    stuff_name: string;
  } | null>(null);

  const allEvents = Array.from(new Set(data.map((stuff) => stuff.event_name)));
  const filterOptions = allEvents.map((event) => ({
    id: event,
    label: event,
  }));

  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    () =>
      filterOptions.reduce((acc, option) => {
        acc[option.id] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const handleDeny = async (stuff_id: number) => {
    try {
      await denyStuff({ stuff_id }).unwrap();
      toast.success("Вы отказались от вещи");
    } catch {
      toast.error("Ошибка при отказе");
    }
  };

  const openConfirmDialog = (stuff: {
    stuff_id: number;
    stuff_name: string;
  }) => {
    setSelectedStuff(stuff);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDeny = async () => {
    if (selectedStuff) {
      await handleDeny(selectedStuff.stuff_id);
      setConfirmDialogOpen(false);
      setSelectedStuff(null);
    }
  };

  const handleApplyFilters = (filters: Record<string, boolean>) => {
    setActiveFilters(filters);
  };

  const filteredData = data.filter((stuff) => {
    const activeEvents = Object.entries(activeFilters)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (activeEvents.length === 0) return true;
    return activeEvents.includes(stuff.event_name);
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-center text-red-500">Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 max-w-full overflow-x-hidden">
      <ButtonToMain className="mb-5" />
      
      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black">
          Мои вещи
        </label>
      </div>

      <div className="mb-4">
        <FilterButton 
          onClick={() => setIsFilterOpen(true)} 
          label="Фильтры" 
        />
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={activeFilters}
        onApply={handleApplyFilters}
        options={filterOptions}
        title="Фильтр по мероприятиям"
        withSearch
      />

      {filteredData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {data.length === 0 ? "У вас нет вещей" : "Нет вещей под выбранный фильтр"}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredData.map((stuff) => {
            const isOpen = openedDescriptionId === stuff.stuff_id;

            return (
              <Card key={stuff.stuff_id} className="w-full max-w-full min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="break-words min-w-0">
                    {stuff.event_name}
                  </CardTitle>
                  <CardDescription className="text-black break-words min-w-0">
                    {stuff.stuff_name}
                  </CardDescription>
                </CardHeader>

<CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
  <div className="relative w-full min-w-0">
    {stuff.stuff_description && (
      <button
        onClick={() => toggleDescription(stuff.stuff_id)}
        className="flex items-center text-sm text-gray-700 hover:text-gray-900 w-full min-w-0"
      >
        <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
        <span className="text-left break-words overflow-hidden text-ellipsis min-w-0">
          Описание
        </span>
      </button>
    )}

    {isOpen && (
      <div className="absolute left-0 mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
        <p className="text-sm text-gray-600 break-words whitespace-pre-line">
          {stuff.stuff_description || "Описание не добавлено"}
        </p>
      </div>
    )}
  </div>

  <div className="w-full sm:w-auto flex justify-end">
    <Button
      variant="light_green"
      size="sm"
      onClick={() =>
        openConfirmDialog({
          stuff_id: stuff.stuff_id,
          stuff_name: stuff.stuff_name,
        })
      }
      className="ml-auto"
    >
      Отказаться
    </Button>
  </div>
</CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Вы уверены, что хотите отказаться?"
        description={selectedStuff ? `${selectedStuff.stuff_name}` : undefined}
        onConfirm={handleConfirmDeny}
        onCancel={() => setConfirmDialogOpen(false)}
        confirmLabel="Да"
        cancelLabel="Нет"
      />
    </div>
  );
};