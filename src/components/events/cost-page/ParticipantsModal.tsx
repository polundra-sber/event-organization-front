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
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Участники покупки</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        ) : participants?.length ? (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {participants.map((participant) => (
              <div 
                key={participant.login} 
                className="border rounded-lg p-3 w-full"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium break-words whitespace-normal">
                      {participant.name} {participant.surname}
                    </p>
                    <p className="text-sm text-gray-500 break-words whitespace-normal">
                      {participant.email}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 break-all sm:break-words sm:whitespace-normal">
                    {participant.login}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Участников нет</p>
        )}
      </DialogContent>
    </Dialog>
  );
};