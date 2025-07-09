"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Users } from "lucide-react";
import { CostAllocationListItem } from "@/lib/api/types/cost-types";
import { ParticipantsModal } from "./ParticipantsModal";
import { ReceiptsModal } from "./ReceiptsModal";
import { useState } from "react";

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
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {purchase.purchase_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold">{purchase.cost} ₽</p>
          
          {purchase.responsible_name && (
            <p className="text-sm">
              Ответственный: {purchase.responsible_name} {purchase.responsible_surname}
            </p>
          )}

          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setShowParticipants(true)}
            >
              <Users className="h-4 w-4 mr-1" />
              Участники ({purchase.countParticipants})
            </Button>

            {purchase.hasReceipt && (
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-800"
                onClick={() => setShowReceipts(true)}
              >
                <Receipt className="h-4 w-4 mr-1" />
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
        <ReceiptsModal
          event_id={event_id}
          purchase_id={purchase.purchase_id}
          onClose={() => setShowReceipts(false)}
        />
      )}
    </>
  );
};