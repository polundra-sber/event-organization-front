"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import EditEventPage from "@/components/create-edit-event/EditEventPage";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Для отображения ошибок
import { AlertCircle } from "lucide-react"; // Иконка для алерта

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function EditEventWrapper() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params?.eventId);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");

  // Получаем метаданные пользователя для мероприятия
  const {
    data: metadata,
    isLoading: metadataLoading,
    error,
  } = useGetUserMetadataQuery(eventId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!metadataLoading && metadata) {
      // Проверяем, что пользователь - создатель и мероприятие активно
      const isCreator = metadata.role_name === "создатель";
      const isEventActive = metadata.event_status_name === "активно";

      if (!isCreator) {
        setDeniedReason("Только создатель может редактировать мероприятие");
        setAccessDenied(true);
      } else if (!isEventActive) {
        setDeniedReason(
          "Редактирование возможно только для активных мероприятий"
        );
        setAccessDenied(true);
      }
    }

    if (error) {
      setDeniedReason("Мероприятие не найдено или произошла ошибка");
      setAccessDenied(true);
    }
  }, [metadata, metadataLoading, error]);

  if (isLoading || metadataLoading) {
    return <Loader />;
  }

  if (accessDenied) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Доступ запрещен</AlertTitle>
          <AlertDescription>
            {deniedReason}
            <button
              onClick={() => router.back()}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              Вернуться назад
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <EditEventPage eventId={eventId} />;
}
