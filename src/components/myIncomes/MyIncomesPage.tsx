"use client";

import { useState } from "react";
import {
  useGetMyIncomesListQuery,
  useMarkIncomeReceivedInMyIncomesListMutation,
} from "@/lib/api/my-incomes-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ButtonToMain } from "../common/ButtonToMain";
import { getInitials } from "@/components/common/UserAvatar";

export const MyIncomesPageContent = () => {
  const { data, isLoading, isError } = useGetMyIncomesListQuery();
  const [markIncomeReceived] = useMarkIncomeReceivedInMyIncomesListMutation();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>({
    unpaid: false,
    paid: false,
    received: false,
  });

  const incomes = data || [];

  const filteredIncomes = incomes.filter((income) => {
    const statusFiltersActive =
      filters.unpaid || filters.paid || filters.received;

    const statusMatch =
      !statusFiltersActive ||
      (filters.unpaid && income.debt_status_name === "не оплачен") ||
      (filters.paid && income.debt_status_name === "оплачен") ||
      (filters.received && income.debt_status_name === "получен");

    const eventFiltersActive = Object.keys(filters).some((key) =>
      key.startsWith("event_") && filters[key]
    );

    const eventMatch =
      !eventFiltersActive ||
      Object.keys(filters).some(
        (key) =>
          key.startsWith("event_") &&
          filters[key] &&
          key === `event_${income.event_id}`
      );

    return statusMatch && eventMatch;
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain className="mb-10" />

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black">Мне должны</label>
      </div>

      <div className="flex justify-start mb-4">
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>

      {filteredIncomes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Никто не должен</p>
      ) : (
        <div className="space-y-4">
          {filteredIncomes.map((income) => (
            <Card key={income.debt_id} className="p-4">
              <div className="mb-2 font-bold text-lg">
                {income.event_name}
              </div>

              <CardContent className="flex items-center gap-4 flex-wrap">
                <Avatar className="w-12 h-12 border border-my-dark-green">
                  <AvatarFallback>
                    {getInitials(income.payer_name, income.payer_surname)}
                  </AvatarFallback>
                </Avatar>

                <div className="bg-my-yellow-green font-bold text-lg px-4 py-2 rounded-xl whitespace-nowrap ml-auto">
                  {income.debt_amount ? `${income.debt_amount} ₽` : "0 ₽"}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold">
                    {income.payer_name || "Имя отсутствует"} {income.payer_surname || ""}
                  </div>
                  <div className="text-sm mt-1 font-medium">
                    Статус: {income.debt_status_name}
                  </div>
                </div>
              </CardContent>

              <div className="mt-4">
                <Button
                  variant="dark_green"
                  size="sm"
                  disabled={income.debt_status_name === "получен"}
                  onClick={async () => {
                    if (income.debt_status_name === "получен") return;

                    try {
                      await markIncomeReceived({
                        debt_id: income.debt_id,
                      }).unwrap();
                      toast.success("Долг отмечен как полученный");
                    } catch {
                      toast.error("Ошибка при изменении статуса");
                    }
                  }}
                  className="w-full"
                >
                  Получен
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FilterModal
        mode="multi"
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={filters}
        onApply={setFilters}
        categories={[
          {
            id: "status",
            label: "Статус",
            options: [
              { id: "unpaid", label: "Не оплачен" },
              { id: "paid", label: "Оплачен" },
              { id: "received", label: "Получен" },
            ],
          },
          {
            id: "event",
            label: "Мероприятие",
            withSearch: true,
            options: Array.from(
              new Map(
                incomes.map((income) => [
                  `event_${income.event_id}`,
                  {
                    id: `event_${income.event_id}`,
                    label: income.event_name,
                  },
                ])
              ).values()
            ),
          },
        ]}
      />
    </div>
  );
};