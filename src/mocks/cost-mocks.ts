import { http, HttpResponse } from "msw";
import {
  CostAllocationListItem,
  CostListResponse,
  UserDemo,
  ReceiptList,
  EventNotExistResponse,
} from "@/lib/api/types/cost-types";

// Существующие мероприятия
const existingEventIds = [1, 888, 999];

// Моковые расходы
const mockCostAllocationList: CostAllocationListItem[] = [
  {
    purchase_id: 1,
    purchase_name: "Продукты",
    responsible_name: "Иван",
    responsible_surname: "Иванов",
    cost: 1250.5,
    hasReceipt: true,
    countParticipants: 3,
  },
  {
    purchase_id: 2,
    purchase_name: "Транспорт",
    cost: 500,
    hasReceipt: false,
    countParticipants: 2,
  },
];

const mockCostAllocationList1: CostAllocationListItem[] = [
  {
    purchase_id: 1,
    purchase_name: "Продукты",
    responsible_name: "Иван",
    responsible_surname: "Иванов",
    cost: 1250.5,
    hasReceipt: true,
    countParticipants: 3,
  },
];

const mockParticipants: UserDemo[] = [
  {
    login: "user1",
    email: "user1@example.com",
    name: "Алексей",
    surname: "Петров",
  },
  {
    login: "user2",
    email: "user2@example.com",
    name: "Мария",
    surname: "Сидорова",
  },
];

export const costHandlers = [
  // Получить список расходов
  http.get("/api/events/:event_id/cost-list", ({ params }) => {
    const eventId = Number(params.event_id);

    if (!existingEventIds.includes(eventId)) {
      return HttpResponse.json<EventNotExistResponse>(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    if (eventId === 999) {
      return HttpResponse.json<CostListResponse>(
        {
          cost_allocation_list: [],
          expenses_existence: false,
        },
        { status: 200 }
      );
    }

    if (eventId === 888) {
      return HttpResponse.json<CostListResponse>(
        {
          cost_allocation_list: [],
          expenses_existence: true,
        },
        { status: 200 }
      );
    }

    return HttpResponse.json<CostListResponse>(
      {
        cost_allocation_list: mockCostAllocationList,
        expenses_existence: true,
      },
      { status: 200 }
    );
  }),

  // Получить персональный список расходов
  http.get("/api/events/:event_id/cost-list-personal", ({ params }) => {
    const eventId = Number(params.event_id);

    if (!existingEventIds.includes(eventId)) {
      return HttpResponse.json<EventNotExistResponse>(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(mockCostAllocationList1, { status: 200 });
  }),

  // Получить участников для покупки
  http.get("/api/events/:event_id/cost-list/:purchase_id/participants", ({ params }) => {
    const eventId = Number(params.event_id);

    if (!existingEventIds.includes(eventId)) {
      return HttpResponse.json<EventNotExistResponse>(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json<UserDemo[]>(mockParticipants, { status: 200 });
  }),

  // Получить чек покупки
  http.get("/api/events/:event_id/purchases-list/:purchase_id/get-receipt", async ({ params }) => {
    const eventId = Number(params.event_id);

    if (!existingEventIds.includes(eventId)) {
      return HttpResponse.json<EventNotExistResponse>(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    const mockFile = new File(["mock receipt content"], "receipt.jpg", {
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("files", mockFile);

    return new HttpResponse(formData, {
      status: 200,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }),
];
