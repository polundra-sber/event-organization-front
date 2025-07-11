import React from "react";
import { useGetReceiptsQuery } from "@/lib/api/my-purchases-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReceiptViewerProps {
  eventId: number;
  purchaseId: number;
  onClose: () => void;
}

const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  eventId,
  purchaseId,
  onClose,
}) => {
  const { data, isLoading, isError } = useGetReceiptsQuery({
    event_id: eventId,
    purchase_id: purchaseId,
  });

  // Функция для создания URL из Blob
  const createObjectURL = (file: Blob) => {
    return URL.createObjectURL(file);
  };

  const handleDownload = (file: Blob) => {
    const url = createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${purchaseId}_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Просмотр чеков</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Загрузка чеков...</p>
        ) : isError ? (
          <p>Ошибка загрузки чеков</p>
        ) : !data?.files?.length ? (
          <p>Нет прикреплённых чеков</p>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pr-2">
            {data.files.map((file, index) => (
              <div key={index} className="border rounded p-4 space-y-2">
                <img
                  src={createObjectURL(file)}
                  alt={`Чек ${index + 1}`}
                  className="w-full rounded"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {file.name || `Чек ${index + 1}`}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptViewer;
