import React from "react";
import { useGetReceiptsQuery } from "@/lib/api/my-purchases-api";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Просмотр чеков</h2>

        {isLoading ? (
          <p>Загрузка чеков...</p>
        ) : isError ? (
          <p>Ошибка загрузки чеков</p>
        ) : !data?.files?.length ? (
          <p>Нет прикреплённых чеков</p>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pr-2">
            {data.files.map((file, index) => (
              <div key={index} className="border rounded p-2">
                <img
                  src={createObjectURL(file)}
                  alt={`Чек ${index + 1}`}
                  className="w-full rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {file.name || `Чек ${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptViewer;
