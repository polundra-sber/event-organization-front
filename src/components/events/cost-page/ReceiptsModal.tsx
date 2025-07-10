"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useGetReceiptForPurchaseQuery } from "@/lib/api/cost-api";
import { Loader } from "@/components/common/Loader";

export const ReceiptsModal = ({
  event_id,
  purchase_id,
  onClose,
}: {
  event_id: number;
  purchase_id: number;
  onClose: () => void;
}) => {
  const { data: receipts, isLoading } = useGetReceiptForPurchaseQuery({
    event_id,
    purchase_id,
  });

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${purchase_id}_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Чеки покупки</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader />
        ) : receipts?.files.length ? (
          <div className="space-y-2">
            {receipts.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span>Чек {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Чеков нет</p>
        )}
      </DialogContent>
    </Dialog>
  );
};