"use client";

import { EventForm } from "@/components/common/EventForm";
import {
  useEditEventMutation,
  useGetEventByIdQuery,
} from "@/lib/api/events-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

interface EditEventPageProps {
  eventId: number;
}

export default function EditEventPage({ eventId }: EditEventPageProps) {
  const router = useRouter();
  const { data: event } = useGetEventByIdQuery(eventId, {
    skip: isNaN(eventId),
  });
  const [editEvent, { isLoading: isEditing }] = useEditEventMutation();

  const handleSubmit = async (data: any) => {
    try {
      await editEvent({
        eventId,
        data,
      }).unwrap();

      toast.success("Мероприятие успешно обновлено!");
      router.push(`/events/${eventId}`);
    } catch (error) {
      toast.error("Ошибка при обновлении мероприятия");
      console.error("Failed to update event:", error);
    }
  };

  const formatEventDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : format(date, "dd/MM/yyyy");
    } catch {
      return "";
    }
  };

  if (!event) {
    return <div>Мероприятие не найдено</div>;
  }

  return (
    <EventForm
      initialData={{
        event_name: event.event_name || "",
        event_description: event.event_description || "",
        event_date: formatEventDate(event.event_date),
        event_time: event.event_time || "",
        location: event.location || "",
        chat_link: event.chat_link || "",
      }}
      eventId={eventId}
      isEditing
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/events/${eventId}`)}
      isLoading={isEditing}
    />
  );
}
