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
import { X, Receipt } from "lucide-react";
import {
  useLazyGetParticipantsForPurchaseQuery,
  useDeleteParticipantsForPurchaseMutation,
} from "@/lib/api/cost-allocation-api";
import { CostAllocationListItem } from "@/lib/api/types/cost-allocation-types";
import { toast } from "sonner";
import ReceiptViewer from "@/components/common/ReceiptViewer";

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
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [fetchParticipants, { data: participants = [], isFetching }] =
    useLazyGetParticipantsForPurchaseQuery();
  const [deleteParticipant] = useDeleteParticipantsForPurchaseMutation();

  const handleOpenParticipantsModal = async () => {
    setShowParticipantsModal(true);
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
      <div className="flex gap-4 items-start w-full max-w-full min-w-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(purchase.purchase_id)}
          className="mt-4 flex-shrink-0"
        />
        <Card className="flex-1 w-full max-w-full min-w-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2 min-w-0">
              <CardTitle className="text-lg font-semibold break-words overflow-hidden text-ellipsis min-w-0">
                {purchase.purchase_name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold break-words min-w-0">{purchase.cost} ₽</p>
            <p className="text-sm break-words min-w-0">
              Ответственный:{" "}
              {purchase.responsible_name
                ? `${purchase.responsible_name} ${purchase.responsible_surname}`
                : "Не назначен"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 min-w-0"
                onClick={handleOpenParticipantsModal}
              >
                Участники ({purchase.countParticipants})
              </Button>

              {purchase.hasReceipt && (
                <Button
                  variant="ghost"
                  className="text-green-600 hover:text-green-800 min-w-0"
                  onClick={() => setShowReceiptsModal(true)}
                >
                  <Receipt className="h-4 w-4 mr-1 flex-shrink-0" />
                  Чеки
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

<Dialog 
  open={showParticipantsModal}
  onOpenChange={setShowParticipantsModal}
>
  <DialogContent className="max-w-[95vw] sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-left break-all whitespace-normal">
        Участники покупки: {purchase.purchase_name}
      </DialogTitle>
    </DialogHeader>

    {isFetching ? (
      <div className="flex justify-center py-4">
        <p className="text-sm text-gray-500">Загрузка участников...</p>
      </div>
    ) : participants.length === 0 ? (
      <p className="text-sm text-gray-500 py-4 text-center">Участников нет</p>
    ) : (
      <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
        {participants.map((p) => (
          <div
            key={p.login}
            className="border rounded-lg p-3 w-full hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-medium break-words whitespace-normal">
                  {p.name} {p.surname}
                </p>
                <p className="text-sm text-gray-500 break-all whitespace-normal mt-1">
                  {p.login}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 flex-shrink-0 mt-1"
                onClick={() => handleDeleteParticipant(p.login)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </DialogContent>
</Dialog>

      {showReceiptsModal && (
        <ReceiptViewer
          eventId={event_id}
          purchaseId={purchase.purchase_id}
          onClose={() => setShowReceiptsModal(false)}
        />
      )}
    </>
  );
};