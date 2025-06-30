import { Event } from "@/lib/api/types/event-types";
import { http, HttpResponse } from "msw";

// Моковые данные
export const mockEvents: Event[] = [
  {
    event_id: 15,
    event_name: "Шашлыки",
    event_description: "Берите пледы и хорошее настроение!",
    event_date: "2025-06-12",
    event_time: "16:00",
    location: "Центральный парк",
    role_name: "организатор",
  },
  {
    event_id: 44,
    event_name: "Кино",
    event_date: "2025-06-15",
    role_name: "участник",
  },
  {
    event_id: 646,
    event_name: "Концерт Кишлака",
    event_date: "2025-01-25",
    role_name: "создатель",
  },
];

export const eventHandlers = [
  // Получение мероприятий
  http.get("/api/events", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return HttpResponse.json(mockEvents);
  }),
];
