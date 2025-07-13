"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import EditEventPage from "@/components/create-edit-event/EditEventPage";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/common/Loader";

export default function EditEventWrapper() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");
  const [validEventId, setValidEventId] = useState<number | null>(null);

  // Проверяем и устанавливаем eventId
  useEffect(() => {
    if (params?.eventId) {
      const id = Number(params.eventId);
      if (!isNaN(id)) {
        setValidEventId(id);
      } else {
        setAccessDenied(true);
        setDeniedReason("Некорректный ID мероприятия");
        setIsLoading(false);
      }
    }
  }, [params?.eventId]);

  // Получаем метаданные пользователя (только при наличии validEventId)
  const {
    data: metadata,
    isLoading: metadataLoading,
    error,
  } = useGetUserMetadataQuery(validEventId!, {
    skip: !validEventId,
  });

  // Проверка авторизации
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else if (validEventId !== null) {
      setIsLoading(false);
    }
  }, [router, validEventId]);

  // Проверка прав доступа и статуса мероприятия
  useEffect(() => {
    if (metadata && !metadataLoading) {
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

  if (isLoading || metadataLoading || validEventId === null) {
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

  return <EditEventPage eventId={validEventId} />;
}
