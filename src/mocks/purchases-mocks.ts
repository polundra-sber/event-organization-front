import { http, HttpResponse } from "msw";
import {
  PurchaseListItem,
  PurchaseListItemCreator,
  PurchaseListItemEditor,
  PurchaseListItemResponsible,
} from "@/lib/api/types/purchases-types";
import { User } from "@/lib/api/types/participants-types";

// Моковые данные пользователей
const mockUsers: Record<string, User> = {
  user1: {
    login: "user1",
    email: "user1@example.com",
    name: "Иван",
    surname: "Иванов",
    role_name: "участник",
    password: null,
    comment_money_transfer: null,
  },
  user2: {
    login: "user2",
    email: "user2@example.com",
    name: "Мария",
    surname: "Петрова",
    role_name: "организатор",
    password: null,
    comment_money_transfer: "На сбер: 89996362576",
  },
  current_user: {
    login: "current_user",
    email: "current@example.com",
    name: "Текущий",
    surname: "Пользователь",
    role_name: "участник",
    password: null,
    comment_money_transfer: null,
  },
};

// Моковые данные покупок
const mockPurchases: Record<number, PurchaseListItem[]> = {
  1: [
    {
      purchase_id: 1,
      purchase_name: "Огурцы",
      purchase_description: "2 кг, свежие",
      responsible_login: "user1",
      responsible_name: "Иван",
      responsible_surname: "Иванов",
    },
    {
      purchase_id: 2,
      purchase_name: "Помидоры",
      purchase_description: "3 кг",
      responsible_login: null,
      responsible_name: null,
      responsible_surname: null,
    },
  ],
  2: [
    {
      purchase_id: 3,
      purchase_name: "Шампанское",
      purchase_description: "2 бутылки",
      responsible_login: "user2",
      responsible_name: "Мария",
      responsible_surname: "Петрова",
    },
  ],
};

export const purchaseHandlers = [
  // Список покупок
  http.get("/api/events/:event_id/purchases-list", ({ params }) => {
    const { event_id } = params;
    const eventPurchases = mockPurchases[event_id as unknown as number];

    if (!eventPurchases) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(eventPurchases, { status: 200 });
  }),

  // Добавить новую покупку
  http.post(
    "/api/events/:event_id/purchases-list/add-purchase",
    async ({ request, params }) => {
      const { event_id } = params;
      const purchaseData = (await request.json()) as PurchaseListItemCreator;

      const eventPurchases = mockPurchases[event_id as unknown as number];
      if (!eventPurchases) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      if (!purchaseData.purchase_name) {
        return HttpResponse.json(
          { error: "Название покупки обязательно" },
          { status: 400 }
        );
      }

      // Находим данные пользователя, если указан responsible_login
      let responsibleName = null;
      let responsibleSurname = null;

      if (
        purchaseData.responsible_login &&
        mockUsers[purchaseData.responsible_login]
      ) {
        const user = mockUsers[purchaseData.responsible_login];
        responsibleName = user.name;
        responsibleSurname = user.surname;
      }

      const newPurchase: PurchaseListItem = {
        purchase_id:
          Math.max(0, ...eventPurchases.map((p) => p.purchase_id)) + 1,
        purchase_name: purchaseData.purchase_name,
        purchase_description: purchaseData.purchase_description || null,
        responsible_login: purchaseData.responsible_login || null,
        responsible_name: responsibleName,
        responsible_surname: responsibleSurname,
      };

      eventPurchases.push(newPurchase);

      return HttpResponse.json(newPurchase, { status: 201 });
    }
  ),

  // Изменить покупку
  http.patch(
    "/api/events/:event_id/purchases-list/:purchase_id/edit-purchase",
    async ({ request, params }) => {
      const { event_id, purchase_id } = params;
      const purchaseData = (await request.json()) as PurchaseListItemEditor;

      const eventPurchases = mockPurchases[event_id as unknown as number];
      if (!eventPurchases) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const purchaseIndex = eventPurchases.findIndex(
        (p) => p.purchase_id === Number(purchase_id)
      );

      if (purchaseIndex === -1) {
        return HttpResponse.json(
          { error: "Покупка с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      // Находим данные пользователя, если указан responsible_login
      let responsibleName = eventPurchases[purchaseIndex].responsible_name;
      let responsibleSurname =
        eventPurchases[purchaseIndex].responsible_surname;

      if (purchaseData.responsible_login !== undefined) {
        if (
          purchaseData.responsible_login &&
          mockUsers[purchaseData.responsible_login]
        ) {
          const user = mockUsers[purchaseData.responsible_login];
          responsibleName = user.name;
          responsibleSurname = user.surname;
        } else {
          responsibleName = null;
          responsibleSurname = null;
        }
      }

      const updatedPurchase = {
        ...eventPurchases[purchaseIndex],
        ...purchaseData,
        responsible_name: responsibleName,
        responsible_surname: responsibleSurname,
      };

      eventPurchases[purchaseIndex] = updatedPurchase;

      return HttpResponse.json(updatedPurchase, { status: 200 });
    }
  ),

  // Удалить покупку
  http.delete(
    "/api/events/:event_id/purchases-list/:purchase_id/delete-purchase",
    ({ params }) => {
      const { event_id, purchase_id } = params;

      const eventPurchases = mockPurchases[event_id as unknown as number];
      if (!eventPurchases) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const initialLength = eventPurchases.length;
      const updatedPurchases = eventPurchases.filter(
        (p) => p.purchase_id !== Number(purchase_id)
      );

      if (updatedPurchases.length === initialLength) {
        return HttpResponse.json(
          { error: "Покупка с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      mockPurchases[event_id as unknown as number] = updatedPurchases;

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // Пользователь берет покупку
  http.patch(
    "/api/events/:event_id/purchases-list/:purchase_id/take-purchase",
    async ({ params }) => {
      const { event_id, purchase_id } = params;
      const currentUser = mockUsers["current_user"];

      const eventPurchases = mockPurchases[event_id as unknown as number];
      if (!eventPurchases) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const purchaseIndex = eventPurchases.findIndex(
        (p) => p.purchase_id === Number(purchase_id)
      );

      if (purchaseIndex === -1) {
        return HttpResponse.json(
          { error: "Покупка с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      const updatedPurchase = {
        ...eventPurchases[purchaseIndex],
        responsible_login: currentUser.login,
        responsible_name: currentUser.name,
        responsible_surname: currentUser.surname,
      };

      eventPurchases[purchaseIndex] = updatedPurchase;

      const response: PurchaseListItemResponsible = {
        purchase_id: updatedPurchase.purchase_id,
        purchase_name: updatedPurchase.purchase_name,
        responsible_login: updatedPurchase.responsible_login,
        responsible_name: updatedPurchase.responsible_name,
        responsible_surname: updatedPurchase.responsible_surname,
        purchase_description: updatedPurchase.purchase_description,
      };

      return HttpResponse.json(response, { status: 200 });
    }
  ),
];
