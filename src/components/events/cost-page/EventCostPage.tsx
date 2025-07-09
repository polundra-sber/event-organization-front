"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useGetCostListQuery,
  useGetPersonalCostListQuery,
} from "@/lib/api/cost-api";
import { Loader } from "@/components/common/Loader";
import { CostCard } from "./CostCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const EventCostPageContent = ({
  event_id,
}: {
  event_id: number;
}) => {
  const [showOnlyMyDebts, setShowOnlyMyDebts] = useState(false);

  // Получаем общий список расходов
  const {
    data: costListData,
    isLoading: isCostListLoading,
  } = useGetCostListQuery(event_id);

  // Получаем персональный список долгов
  const {
    data: personalCostListData,
    isLoading: isPersonalCostListLoading,
  } = useGetPersonalCostListQuery(event_id);

  if (isCostListLoading || isPersonalCostListLoading) {
    return <Loader />;
  }

  if (!costListData || !personalCostListData) {
    return <p>Ошибка загрузки данных</p>;
  }

  const displayData = showOnlyMyDebts
    ? personalCostListData
    : costListData.cost_allocation_list;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <h1 className="text-lg font-bold text-my-black">Список расходов</h1>
      </div>

      {/* Тумблер "Мои долги" */}
      <div className="mb-4 flex justify-start">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2 bg-my-light-green">
          <Label htmlFor="my-debts-switch" className="text-sm font-bold">
            Мои долги
          </Label>
          <Switch
            id="my-debts-switch"
            checked={showOnlyMyDebts}
            onCheckedChange={setShowOnlyMyDebts}
          />
        </div>
      </div>

      {/* Сообщения при отсутствии данных */}
      {displayData.length === 0 && (
        <p className="text-gray-500 text-center">
          {showOnlyMyDebts
            ? "У вас нет долгов"
            : costListData.expenses_existence
              ? "Создатель не распределил расходы"
              : "Расходов нет"}
        </p>
      )}

      {/* Список расходов */}
      <div className="space-y-4">
        {displayData.map((item) => (
          <CostCard
            key={item.purchase_id}
            purchase={item}
            event_id={event_id}
          />
        ))}
      </div>
    </div>
  );
};
