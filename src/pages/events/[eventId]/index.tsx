import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EventPage } from "@/components/events/EventIdPage";
import { Loader } from "@/components/common/Loader";

export default function EventsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eventId, setEventId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, []);

  // Отслеживаем появление eventId в query
  useEffect(() => {
    if (router.isReady && router.query.eventId) {
      const id = Number(router.query.eventId);
      if (!isNaN(id)) {
        setEventId(id);
      }
    }
  }, [router.isReady, router.query.eventId]);

  if (isLoading || !eventId) {
    return <Loader />;
  }

  return <EventPage eventId={eventId} />;
}
