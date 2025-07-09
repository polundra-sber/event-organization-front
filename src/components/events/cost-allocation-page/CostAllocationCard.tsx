"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLazyGetParticipantsForPurchaseQuery, useDeleteParticipantsForPurchaseMutation } from "@/lib/api/cost-allocation-api";
import { CostAllocationListItem } from "@/lib/api/types/cost-allocation-types";
import { toast } from "sonner";

interface CostAllocationCardProps {
  purchase: CostAllocationListItem;
  selected: boolean;
  toggleSelect: (id: number) => void;
  event_id: number;
  onParticipantsLoaded?: (logins: string[]) => void;
}

export const CostAllocationCard = ({
  purchase,
  selected,
  toggleSelect,
  event_id,
  onParticipantsLoaded,
}: CostAllocationCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [fetchParticipants, { data: participants = [], isFetching }] =
    useLazyGetParticipantsForPurchaseQuery();
  const [deleteParticipant] = useDeleteParticipantsForPurchaseMutation();

  const handleOpenModal = async () => {
    setShowModal(true);
    const result = await fetchParticipants({
      event_id,
      purchase_id: purchase.purchase_id,
    });

    if (onParticipantsLoaded && result.data && Array.isArray(result.data)) {
      onParticipantsLoaded(result.data.map((p) => p.login));
    }
  };

  const handleDeleteParticipant = async (login: string) => {
    try {
      await deleteParticipant({
        event_id,
        purchase_id: purchase.purchase_id,
        logins: [login],
      }).unwrap();
      
      toast.success("Участник удален");
      
      const result = await fetchParticipants({
        event_id,
        purchase_id: purchase.purchase_id,
      }).unwrap();
      
      if (onParticipantsLoaded && Array.isArray(result)) {
        onParticipantsLoaded(result.map((p) => p.login));
      }
    } catch {
      toast.error("Ошибка при удалении участника");
    }
  };

  return (
    <>
      <div className="flex gap-4 items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(purchase.purchase_id)}
          className="mt-4"
        />
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {purchase.purchase_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">{purchase.cost} ₽</p>
            <p className="text-sm">
              Ответственный:{" "}
              {purchase.responsible_name
                ? `${purchase.responsible_name} ${purchase.responsible_surname}`
                : "Не назначен"}
            </p>
            <div className="text-sm">
              <button
                onClick={handleOpenModal}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Участников ({purchase.countParticipants}):
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Участники покупки</DialogTitle>
          </DialogHeader>

          {isFetching ? (
            <p className="text-sm text-gray-500">Загрузка участников...</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {participants.map((p) => (
                <li key={p.login} className="text-sm flex items-center justify-between">
                  <div>
                    {p.name} {p.surname} ({p.login})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteParticipant(p.login)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};