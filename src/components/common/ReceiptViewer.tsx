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

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
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
          <div className="space-y-4 overflow-y-auto max-h-[70vh]">
            {data.files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Чек ${index + 1}`}
                className="w-full rounded border"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptViewer;
