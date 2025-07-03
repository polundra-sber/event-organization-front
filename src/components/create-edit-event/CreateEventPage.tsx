"use client";

import { EventForm } from "@/components/common/EventForm";
import { useCreateEventMutation } from "@/lib/api/events-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleSubmit = async (data: any) => {
    const response = await createEvent(data).unwrap();
    toast.success("Мероприятие успешно создано!");
    router.push(`/events/${response.event_id}`);
  };

  return <EventForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
