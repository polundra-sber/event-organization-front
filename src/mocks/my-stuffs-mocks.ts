import { http, HttpResponse } from "msw";
import { MyStuffListItem } from "@/lib/api/types/my-stuff-types";

let mockStuffs: MyStuffListItem[] = [
  {
    stuff_id: 1,
    name: "Плед",
    description: "Для пикника",
    event_id: 1,
    event_name: "Пикник выходного дня",
  },
  {
    stuff_id: 2,
    name: "Бумажник",
    description: "На мероприятие",
    event_id: 1,
    event_name: "Пикник выходного дня3",
  },
  {
    stuff_id: 3,
    name: "Мяч",
    event_id: 1,
    event_name: "Пикник",
  },
  {
    stuff_id: 4,
    name: "Помада",
    event_id: 1,
    event_name: "Вечеринка",
  },
  { stuff_id: 5,
    name: "Плед",
    description: "Для пикника",
    event_id: 1,
    event_name: "Пикник выходного дня2",
  },
  {
    stuff_id: 6,
    name: "Бумажник",
    description: "На мероприятие",
    event_id: 1,
    event_name: "Пикник выходного дня1",
  },
  {
    stuff_id: 7,
    name: "Мяч",
    event_id: 1,
    event_name: "Пикник1",
  },
  {
    stuff_id: 8,
    name: "Помада",
    event_id: 1,
    event_name: "Вечеринка1",
  },
];


export const myStuffHandlers = [
  http.get(`/api/events/my-stuffs-list`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return HttpResponse.json(mockStuffs);
  }),

  http.delete(`/api/events/:event_id/my-stuffs-list/:stuff_id/deny-stuff`, ({ params }) => {
    const { event_id, stuff_id } = params;

    if (stuff_id === 999) {
      return HttpResponse.json(
        { error: "Мероприятие или вещь не найдены" },
        { status: 404 }
      );
    }

    mockStuffs = mockStuffs.filter((s) => s.stuff_id !== stuff_id);

    return HttpResponse.json({ message: "Вещь удалена" }, { status: 200 });
  }),
];
