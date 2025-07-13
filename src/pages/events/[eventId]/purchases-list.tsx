"use client";

import { EventPurchasesPageContent } from "@/components/events/purchases-page/EventPurchasesPage";
import { useRouter, useParams } from "next/navigation";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/common/Loader";
import { useEffect, useState } from "react";

export default function EventPurchasesPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");
  const [eventId, setEventId] = useState<number | null>(null); // Храним eventId в состоянии

  // Получаем метаданные пользователя для мероприятия
  const {
    data: metadata,
    isLoading: metadataLoading,
    error,
  } = useGetUserMetadataQuery(eventId!, { skip: !eventId }); // Запрос выполнится только если eventId есть

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Следим за params.eventId и обновляем состояние
  useEffect(() => {
    if (params?.eventId) {
      const id = Number(params.eventId);
      if (!isNaN(id)) {
        setEventId(id);
      } else {
        setAccessDenied(true);
        setDeniedReason("Некорректный ID мероприятия");
      }
    }
  }, [params?.eventId]);

  useEffect(() => {
    if (error) {
      setDeniedReason("Мероприятие не найдено или произошла ошибка");
      setAccessDenied(true);
    }
  }, [error]);

  if (isLoading || metadataLoading || !eventId) {
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

  return <EventPurchasesPageContent event_id={eventId} />;
}
