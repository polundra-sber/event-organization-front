"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Users } from "lucide-react";
import { CostAllocationListItem } from "@/lib/api/types/cost-types";
import { ParticipantsModal } from "./ParticipantsModal";
import { useState } from "react";
import ReceiptViewer from "@/components/common/ReceiptViewer";

export const CostCard = ({
  purchase,
  event_id,
}: {
  purchase: CostAllocationListItem;
  event_id: number;
}) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [showReceipts, setShowReceipts] = useState(false);

  return (
    <>
      <Card className="relative w-full max-w-full min-w-0">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2 min-w-0">
            <CardTitle className="text-lg font-semibold break-words overflow-hidden text-ellipsis min-w-0">
              {purchase.purchase_name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold break-words min-w-0">{purchase.cost} ₽</p>

          {purchase.responsible_name && (
            <p className="text-sm break-words min-w-0">
              Ответственный: {purchase.responsible_name}{" "}
              {purchase.responsible_surname}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 min-w-0"
              onClick={() => setShowParticipants(true)}
            >
              <Users className="h-4 w-4 mr-1 flex-shrink-0" />
              Участники ({purchase.countParticipants})
            </Button>

            {purchase.hasReceipt && (
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-800 min-w-0"
                onClick={() => setShowReceipts(true)}
              >
                <Receipt className="h-4 w-4 mr-1 flex-shrink-0" />
                Чеки
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Модальные окна */}
      {showParticipants && (
        <ParticipantsModal
          event_id={event_id}
          purchase_id={purchase.purchase_id}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {showReceipts && (
        <ReceiptViewer
          eventId={event_id}
          purchaseId={purchase.purchase_id}
          onClose={() => setShowReceipts(false)}
        />
      )}
    </>
  );
};