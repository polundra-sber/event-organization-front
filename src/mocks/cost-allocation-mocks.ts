import { http, HttpResponse } from "msw";
import {
  CostAllocationListItem,
  UserDemo,
} from "@/lib/api/types/cost-allocation-types";

import { User } from "@/lib/api/types/participants-types";

// Моковые пользователи
const mockUsers: Record<string, UserDemo> = {
  user1: {
      login: "user1",
      email: "user1@example.com",
      name: "Иван",
      surname: "Иванов",
  },
  user2: {
    login: "user2",
    email: "user2@example.com",
    name: "Мария",
    surname: "Петрова",
  },
  main_player: {
    login: "main_player",
    email: "main@example.com",
    name: "Алина",
    surname: "Смирнов",
  },
};

// Моковые данные распределения
const mockCostAllocations: Record<number, CostAllocationListItem[]> = {
  1: [
    {
      purchase_id: 1,
      purchase_name: "Огурцы",
      responsible_name: "Иван",
      responsible_surname: "Иванов",
      cost: 123.99,
      hasReceipt: true,
      countParticipants: 2,
    },
    {
      purchase_id: 2,
      purchase_name: "Помидоры",
      responsible_name: "Мария",
      responsible_surname: "Петрова",
      cost: 99.5,
      hasReceipt: false,
      countParticipants: 0,
    },
  ],
};

const mockParticipantsForPurchase: Record<number, string[]> = {
  1: ["user1", "main_player"],
  2: [],
};

export const costAllocationHandlers = [
  // Получить список распределения
  http.get("/api/events/:event_id/cost-allocation-list", ({ params }) => {
    const { event_id } = params;
    const list = mockCostAllocations[Number(event_id)];

    if (!list) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(list, { status: 200 });
  }),

  // Получить участников для покупки
  http.get(
    "/api/events/:event_id/cost-allocation-list/:purchase_id/participants",
    ({ params }) => {
      const { purchase_id, event_id } = params;
      const list = mockCostAllocations[Number(event_id)];
      if (!list) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const logins = mockParticipantsForPurchase[Number(purchase_id)] || [];
      const participants = logins.map((login) => mockUsers[login]);

      return HttpResponse.json(participants, { status: 200 });
    }
  ),

  // Добавить участников к покупке
  http.post(
    "/api/events/:event_id/cost-allocation-list/:purchase_id/add-participants",
    async ({ request, params }) => {
      const { purchase_id, event_id } = params;
      const body = (await request.json()) as string[];

      if (!Array.isArray(body) || body.some((login) => !mockUsers[login])) {
        return new HttpResponse(null, { status: 400 });
      }

      const purchaseIdNum = Number(purchase_id);
      const eventIdNum = Number(event_id);

      mockParticipantsForPurchase[purchaseIdNum] = [
        ...(mockParticipantsForPurchase[purchaseIdNum] || []),
        ...body,
      ];

      // Обновляем countParticipants
      const costAllocList = mockCostAllocations[eventIdNum];
      if (costAllocList) {
        const purchase = costAllocList.find(p => p.purchase_id === purchaseIdNum);
        if (purchase) {
          purchase.countParticipants = mockParticipantsForPurchase[purchaseIdNum].length;
        }
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // Удалить участников у покупки
  http.delete(
    "/api/events/:event_id/cost-allocation-list/:purchase_id/participants",
    async ({ request, params }) => {
      const { purchase_id, event_id } = params;
      const body = (await request.json()) as string[];

      if (!Array.isArray(body)) {
        return new HttpResponse(null, { status: 400 });
      }

      const purchaseIdNum = Number(purchase_id);
      const eventIdNum = Number(event_id);

      const current = mockParticipantsForPurchase[purchaseIdNum] || [];
      mockParticipantsForPurchase[purchaseIdNum] = current.filter(
        (login) => !body.includes(login)
      );

      // Обновляем countParticipants
      const costAllocList = mockCostAllocations[eventIdNum];
      if (costAllocList) {
        const purchase = costAllocList.find(p => p.purchase_id === purchaseIdNum);
        if (purchase) {
          purchase.countParticipants = mockParticipantsForPurchase[purchaseIdNum].length;
        }
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // Отправить финальный расчет
  http.post(
    "/api/events/:event_id/cost-allocation-list/send-cost-allocation-list",
    ({ params }) => {
      const { event_id } = params;
      const list = mockCostAllocations[Number(event_id)];
      if (!list) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      // Тут можно имитировать флаг cost_allocated = true
      return new HttpResponse(null, { status: 200 });
    }
  ),

  // Получить чек
  http.get(
    "/api/events/:event_id/purchases-list/:purchase_id/get-receipt",
    ({ params }) => {
      const { event_id, purchase_id } = params;

      const list = mockCostAllocations[Number(event_id)];
      if (!list) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      // Просто возвращаем массив из моковых файлов (строки как имена файлов)
      return HttpResponse.json(
        {
          files: ["receipt1.jpg", "receipt2.jpg"],
        },
        { status: 200 }
      );
    }
  ),
];
