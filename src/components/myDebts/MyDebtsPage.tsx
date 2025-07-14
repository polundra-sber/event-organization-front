"use client";

import { useState } from "react";
import {
  useGetMyDebtsListQuery,
  useMarkDebtPaidInMyDebtsListMutation,
} from "@/lib/api/my-debts-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ButtonToMain } from "../common/ButtonToMain";
import { getInitials } from "@/components/common/UserAvatar";
import { Loader } from "../common/Loader";

export const MyDebtsPageContent = () => {
  const { data, isLoading, isError } = useGetMyDebtsListQuery();
  const [markDebtPaid] = useMarkDebtPaidInMyDebtsListMutation();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>({
    unpaid: false,
    paid: false,
    received: false,
  });

  const [paidDebts, setPaidDebts] = useState<Set<number>>(new Set());

  const debts = data || [];

  const filteredDebts = debts.filter((debt) => {
    const statusFiltersActive =
      filters.unpaid || filters.paid || filters.received;

    const statusMatch =
      !statusFiltersActive ||
      (filters.unpaid && debt.debt_status_name === "не оплачен") ||
      (filters.paid && debt.debt_status_name === "оплачен") ||
      (filters.received && debt.debt_status_name === "получен");

    const eventFiltersActive = Object.keys(filters).some(
      (key) => key.startsWith("event_") && filters[key]
    );

    const eventMatch =
      !eventFiltersActive ||
      Object.keys(filters).some(
        (key) =>
          key.startsWith("event_") &&
          filters[key] &&
          key === `event_${debt.event_id}`
      );

    return statusMatch && eventMatch;
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 w-full max-w-full overflow-hidden">
      <ButtonToMain className="mb-5" />

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4 w-full max-w-full">
        <label className="text-lg font-bold text-my-black break-all">
          Мои долги
        </label>
      </div>

      <div className="flex justify-start mb-4 w-full max-w-full">
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>

      {filteredDebts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет задолженностей</p>
      ) : (
        <div className="space-y-4 w-full max-w-full">
          {filteredDebts.map((debt) => (
            <Card key={debt.debt_id} className="w-full max-w-full overflow-hidden p-4">
              <div className="mb-2 font-bold text-lg break-all">
                {debt.event_name}
              </div>

              <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-full">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Avatar className="w-12 h-12 border border-my-dark-green flex-shrink-0">
                    <AvatarFallback>
                      {getInitials(debt.recipient_name, debt.recipient_surname)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold break-all">
                      {debt.recipient_name || "Имя отсутствует"} {debt.recipient_surname || ""}
                    </div>
                    <div className="text-sm break-all whitespace-pre-wrap">
                      {debt.comment_money_transfer || "Комментарий отсутствует"}
                    </div>
                    <div className="text-sm mt-1 font-medium break-all">
                      Статус: {debt.debt_status_name}
                    </div>
                  </div>
                </div>

                <div className="bg-my-yellow-green font-bold text-lg px-4 py-2 rounded-xl whitespace-nowrap ml-auto sm:ml-0 flex-shrink-0">
                  {debt.debt_amount ? `${debt.debt_amount} ₽` : "0 ₽"}
                </div>
              </CardContent>

              <div className="mt-4 w-full">
                <Button
                  variant="dark_green"
                  size="sm"
                  disabled={
                    debt.debt_status_name !== "не оплачен" ||
                    paidDebts.has(debt.debt_id)
                  }
                  className={`w-full max-w-full ${
                    debt.debt_status_name === "оплачен" ||
                    paidDebts.has(debt.debt_id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={async () => {
                    try {
                      await markDebtPaid({
                        debt_id: debt.debt_id,
                      }).unwrap();
                      toast.success("Долг отмечен как оплаченный");
                      setPaidDebts((prev) => new Set(prev).add(debt.debt_id));
                    } catch {
                      toast.error("Ошибка при изменении статуса");
                    }
                  }}
                >
                  Оплачен
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
                debts.map((debt) => [
                  `event_${debt.event_id}`,
                  {
                    id: `event_${debt.event_id}`,
                    label: debt.event_name,
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
