import { http, HttpResponse } from "msw";
import { MyStuffListItem } from "@/lib/api/types/my-stuff-types";

let mockStuffs: MyStuffListItem[] = [
  {
    stuff_id: 1,
    stuff_name: "Плед",
    stuff_description: "Для пикника",
    event_id: 1,
    event_name: "Пикник выходного дня",
  },
  {
    stuff_id: 2,
    stuff_name: "Бумажник",
    stuff_description: "На мероприятие",
    event_id: 1,
    event_name: "Пикник выходного дня3",
  },
  {
    stuff_id: 3,
    stuff_name: "Мяч",
    event_id: 1,
    event_name: "Пикник",
  },
  {
    stuff_id: 4,
    stuff_name: "Помада",
    event_id: 1,
    event_name: "Вечеринка",
  },
  {
    stuff_id: 5,
    stuff_name: "Плед",
    stuff_description: "Для пикника",
    event_id: 1,
    event_name: "Пикник выходного дня2",
  },
  {
    stuff_id: 6,
    stuff_name: "Бумажник",
    stuff_description: "На мероприятие",
    event_id: 1,
    event_name: "Пикник выходного дня1",
  },
  {
    stuff_id: 7,
    stuff_name: "Мяч",
    event_id: 1,
    event_name: "Пикник1",
  },
  {
    stuff_id: 8,
    stuff_name: "Помада",
    event_id: 1,
    event_name: "Вечеринка1",
  },
];

export const myStuffHandlers = [
  http.get(`/api/my-stuffs-list`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return HttpResponse.json(mockStuffs);
  }),

  http.delete(
    `/api/my-stuffs-list/:stuff_id/deny-stuff`,
    ({ params }) => {
      const { stuff_id } = params;
      //в будущем надо убрать и исправить
      if (stuff_id === 999) {
        return HttpResponse.json(
          { error: "Мероприятие или вещь не найдены" },
          { status: 404 }
        );
      }

      mockStuffs = mockStuffs.filter((s) => s.stuff_id !== Number(stuff_id));

      return HttpResponse.json({ message: "Вещь удалена" }, { status: 200 });
    }
  ),
];
