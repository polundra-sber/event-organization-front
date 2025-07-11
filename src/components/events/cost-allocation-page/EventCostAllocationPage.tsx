"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetCostAllocationListQuery,
  useAddParticipantsForPurchaseMutation,
  useSendCostAllocationListMutation,
  useGetParticipantsForPurchaseQuery,
} from "@/lib/api/cost-allocation-api";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EventRole } from "@/lib/api/types/event-types";
import { ParticipantsPickerModal } from "./ParticipantsPickerModal";
import { CostAllocationCard } from "./CostAllocationCard";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface EventCostAllocationPageContentProps {
  event_id: number;
}

export const EventCostAllocationPageContent = ({
  event_id,
}: EventCostAllocationPageContentProps) => {
  const { data: allocations = [], isLoading, isError } =
    useGetCostAllocationListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);
  const [participantsMap, setParticipantsMap] = useState<Record<number, string[]>>({});

  const [addParticipants] = useAddParticipantsForPurchaseMutation();
  const [sendAllocation] = useSendCostAllocationListMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [isSendConfirmationOpen, setIsSendConfirmationOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const userRole: EventRole = (metadata?.role_name as EventRole) || "участник";
  const isCreator = userRole === "создатель";

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddParticipants = async (logins: string[]) => {
    try {
      for (const id of selectedIds) {
        const existing = participantsMap[id] || [];
        const newLogins = logins.filter(login => !existing.includes(login));
        
        if (newLogins.length === 0) continue;

        await addParticipants({
          event_id,
          purchase_id: id,
          logins: newLogins,
        }).unwrap();

        setParticipantsMap((prev) => ({
          ...prev,
          [id]: [...existing, ...newLogins],
        }));
      }
      toast.success("Участники добавлены");
      setSelectedIds([]);
      setParticipantsModalOpen(false);
    } catch {
      toast.error("Ошибка при добавлении участников");
    }
  };

  const handleSendConfirmation = async () => {
    setIsSending(true);
    try {
      await sendAllocation({ event_id }).unwrap();
      toast.success("Расчет отправлен!");
    } catch {
      toast.error("Ошибка при отправке расчета");
    } finally {
      setIsSending(false);
      setIsSendConfirmationOpen(false);
    }
  };

  const allHaveParticipants = useMemo(() => {
    return (
      allocations.length > 0 &&
      allocations.every((item) => (participantsMap[item.purchase_id] || []).length > 0)
    );
  }, [allocations, participantsMap]);

  if (isLoading) return <p className="text-center p-4">Загрузка...</p>;
  if (isError) return <p className="text-red-500 text-center p-4">Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 max-w-full overflow-x-hidden">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <h1 className="text-lg font-bold text-my-black break-words min-w-0">
          Распределение расходов
        </h1>
      </div>

      {isCreator && allocations.length > 0 && (
        <div className="mb-4 space-y-2">
          <Button
            variant="dark_green"
            disabled={!allHaveParticipants}
            onClick={() => setIsSendConfirmationOpen(true)}
            className="w-full py-3"
          >
            Отправить расчет
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 min-w-0"
              onClick={() => setSelectedIds(allocations.map(a => a.purchase_id))}
            >
              Выбрать всех
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-0"
              onClick={() => setSelectedIds([])}
            >
              Очистить
            </Button>
          </div>
        </div>
      )}

      {allocations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет покупок</p>
      ) : (
        <div className="space-y-4">
          {allocations.map((item) => (
            <CostAllocationCard
              key={item.purchase_id}
              purchase={item}
              selected={selectedIds.includes(item.purchase_id)}
              toggleSelect={toggleSelect}
              event_id={event_id}
              onParticipantsLoaded={(logins) =>
                setParticipantsMap((prev) => ({
                  ...prev,
                  [item.purchase_id]: logins,
                }))
              }
            />
          ))}
        </div>
      )}

      {isCreator && (
        <div className="sticky bottom-4 bg-white p-4 rounded-lg shadow-lg mt-4 border border-gray-200">
          <Button
            variant="bright_green"
            disabled={selectedIds.length === 0}
            onClick={() => setParticipantsModalOpen(true)}
            className="w-full"
          >
            Добавить участников
          </Button>
        </div>
      )}

      {participantsModalOpen && (
        <ParticipantsPickerModal
          eventId={event_id}
          onSubmit={handleAddParticipants}
          onCancel={() => setParticipantsModalOpen(false)}
        />
      )}

      <ConfirmationDialog
        isOpen={isSendConfirmationOpen}
        onOpenChange={setIsSendConfirmationOpen}
        title="Отправить расчет?"
        description="Вы уверены, что хотите отправить расчет участникам?"
        onConfirm={handleSendConfirmation}
        confirmLabel={isSending ? "Отправка..." : "Отправить"}
        cancelLabel="Отмена"
      />
    </div>
  );
};