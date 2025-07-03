import {
  Event,
  EventEditor,
  EventUserMetadata,
} from "@/lib/api/types/event-types";
import { http, HttpResponse } from "msw";

// Моковые данные
export const mockEvents: Event[] = [
  {
    event_id: 15,
    event_name: "Шашлыки id 15",
    event_description: "Берите пледы и хорошее настроение!",
    event_date: "2025-06-12",
    event_time: "16:00",
    location: "Центральный парк",
    role_name: "организатор",
    event_status_name: "активно",
    chat_link: "https://t.me/chat123",
  },
  {
    event_id: 44,
    event_name: "Кино",
    event_date: "2025-06-15",
    role_name: "участник",
    event_status_name: "активно",
  },
  {
    event_id: 646,
    event_name: "Концерт",
    event_date: "2025-01-25",
    role_name: "создатель",
    event_status_name: "завершено",
  },
  {
    event_id: 1234,
    event_name: "Концерт 2",
    event_date: "2025-01-25",
    role_name: "создатель",
    event_status_name: "активно",
  },
  {
    event_id: 123,
    event_name: "Концерт 2 id 123 участник",
    event_date: "2025-01-25",
    role_name: "участник",
    event_status_name: "активно",
  },
];

export const eventHandlers = [
  // Получение всех мероприятий
  http.get("/api/events", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return HttpResponse.json(mockEvents);
  }),

  // Создание мероприятия
  http.post("/api/create_event", async ({ request }) => {
    //return HttpResponse.json({ error: "Специальная ошибка" }, { status: 409 });

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const newEvent = (await request.json()) as Partial<EventEditor>;
    const createdEvent: Event = {
      event_id: Math.floor(Math.random() * 1000),
      event_name: newEvent.event_name || "Новое мероприятие",
      event_description: newEvent.event_description,
      event_date: newEvent.event_date || new Date().toISOString().split("T")[0],
      event_time: newEvent.event_time,
      location: newEvent.location || "Место не указано",
      role_name: "создатель",
      event_status_name: "активно",
      chat_link: newEvent.chat_link,
    };

    mockEvents.push(createdEvent);
    return HttpResponse.json(createdEvent, { status: 201 });
  }),

  // Поиск мероприятия по ID
  http.get("/api/find_event/:event_id", ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { event_id } = params;
    const event = mockEvents.find((e) => e.event_id === Number(event_id));

    if (!event) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(event);
  }),

  // Запрос на присоединение к мероприятию
  http.post("/api/join_event_request/:event_id", ({ params, request }) => {
    const { event_id } = params;
    const event = mockEvents.find((e) => e.event_id === Number(event_id));

    if (!event) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    if (event.event_id !== 15) {
      return HttpResponse.json(
        { error: "Вы уже присоединены к данному мероприятию" },
        { status: 409 }
      );
    }

    return HttpResponse.json("Заявка на присоединение отправлена", {
      status: 201,
    });
  }),

  // Покинуть мероприятие
  http.delete("/api/leave_event/:event_id", ({ params }) => {
    const { event_id } = params;
    const index = mockEvents.findIndex((e) => e.event_id === Number(event_id));

    if (index === -1) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 410 }
      );
    }

    mockEvents.splice(index, 1);

    return HttpResponse.json("Участник покинул мероприятие");
  }),

  // Удаление мероприятия
  http.delete("/api/delete_event/:event_id", ({ params }) => {
    const { event_id } = params;
    const index = mockEvents.findIndex((e) => e.event_id === Number(event_id));

    if (index === -1) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 410 }
      );
    }

    mockEvents.splice(index, 1);
    return HttpResponse.json("Мероприятие удалено");
  }),

  // Завершение мероприятия
  http.patch("/api/complete_event/:event_id", ({ params }) => {
    const { event_id } = params;
    const event = mockEvents.find((e) => e.event_id === Number(event_id));

    if (!event) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 410 }
      );
    }

    event.event_status_name = "завершено";
    return HttpResponse.json("Мероприятие завершено");
  }),

  // Получение карточки мероприятия
  http.get("/api/events/:event_id", ({ params }) => {
    const { event_id } = params;
    const event = mockEvents.find((e) => e.event_id === Number(event_id));

    if (!event) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(event);
  }),

  // Редактирование мероприятия
  http.patch("/api/events/:event_id/edit", async ({ params, request }) => {
    const { event_id } = params;
    const updates = (await request.json()) as Partial<EventEditor>;
    const event = mockEvents.find((e) => e.event_id === Number(event_id));

    if (!event) {
      return HttpResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    Object.assign(event, updates);
    return HttpResponse.json(event, { status: 201 });
  }),

  http.get("/api/events/:event_id/user-metadata", ({ params }) => {
    const { event_id } = params;

    // Мероприятие не найдено
    if (event_id === "999") {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    // Успешный ответ
    return HttpResponse.json<EventUserMetadata>(
      {
        role_name: "создатель",
        event_status_name: "активно",
      },
      { status: 200 }
    );
  }),
];
