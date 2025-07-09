"use client";

import { EventCostPageContent } from "@/components/events/cost-page/EventCostPage";
import { useRouter, useParams } from "next/navigation";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/common/Loader";
import { useEffect, useState } from "react";

export default function EventCostPage() {
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

  return <EventCostPageContent event_id={eventId} />;
}
