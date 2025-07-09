"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetParticipantsForPurchaseQuery } from "@/lib/api/cost-api";
import { Loader } from "@/components/common/Loader";

export const ParticipantsModal = ({
  event_id,
  purchase_id,
  onClose,
}: {
  event_id: number;
  purchase_id: number;
  onClose: () => void;
}) => {
  const { data: participants, isLoading } = useGetParticipantsForPurchaseQuery({
    event_id,
    purchase_id,
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Участники покупки</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader />
        ) : participants?.length ? (
          <ul className="space-y-2">
            {participants.map((participant) => (
              <li key={participant.login} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">
                    {participant.name} {participant.surname}
                  </p>
                  <p className="text-sm text-gray-500">{participant.email}</p>
                </div>
                <span className="text-sm text-gray-500">{participant.login}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Участников нет</p>
        )}
      </DialogContent>
    </Dialog>
  );
};