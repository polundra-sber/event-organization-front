import { http, HttpResponse } from "msw";
import {
  StuffListItem,
  StuffListItemCreator,
  StuffListItemEditor,
  StuffListItemResponsible,
} from "@/lib/api/types/stuffs-types";
import { User } from "@/lib/api/types/participants-types";

// Пример пользователей (можно переиспользовать твои mockUsers)
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

// Моковые данные вещей по мероприятиям
const mockStuffs: Record<number, StuffListItem[]> = {
  1: [
    {
      stuff_id: 1,
      stuff_name: "Веревка",
      stuff_description: "5 метров, канатная",
      responsible_login: "user1",
      responsible_name: "Иван",
      responsible_surname: "Иванов",
    },
    {
      stuff_id: 2,
      stuff_name: "Спальник",
      stuff_description: "Зимний, -15",
      responsible_login: null,
      responsible_name: null,
      responsible_surname: null,
    },
  ],
  2: [
    {
      stuff_id: 3,
      stuff_name: "Котелок",
      stuff_description: "2 литра",
      responsible_login: "user2",
      responsible_name: "Мария",
      responsible_surname: "Петрова",
    },
  ],
};

export const stuffHandlers = [
  // Получить список вещей
  http.get("/api/events/:event_id/stuffs-list", ({ params }) => {
    const { event_id } = params;
    const stuffs = mockStuffs[event_id as unknown as number];

    if (!stuffs) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(stuffs, { status: 200 });
  }),

  // Добавить новую вещь
  http.post("/api/events/:event_id/stuffs-list/add-stuff", async ({ request, params }) => {
    const { event_id } = params;
    const stuffData = (await request.json()) as StuffListItemCreator;

    const stuffs = mockStuffs[event_id as unknown as number];
    if (!stuffs) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

      if (!stuffData.stuff_name) {
        return HttpResponse.json(
          { error: "Название задачи обязательно" },
          { status: 400 }
        );
      }

    let responsibleName = null;
    let responsibleSurname = null;

    if (stuffData.responsible_login && mockUsers[stuffData.responsible_login]) {
      const user = mockUsers[stuffData.responsible_login];
      responsibleName = user.name;
      responsibleSurname = user.surname;
    }

    const newStuff: StuffListItem = {
      stuff_id: Math.max(0, ...stuffs.map((s) => s.stuff_id)) + 1,
      stuff_name: stuffData.stuff_name,
      stuff_description: stuffData.stuff_description || null,
      responsible_login: stuffData.responsible_login || null,
      responsible_name: responsibleName,
      responsible_surname: responsibleSurname,
    };

    stuffs.push(newStuff);

    return HttpResponse.json(newStuff, { status: 201 });
  }),

  // Редактировать вещь
  http.patch("/api/events/:event_id/stuffs-list/:stuff_id/edit-stuff", async ({ request, params }) => {
    const { event_id, stuff_id } = params;
    const stuffData = (await request.json()) as StuffListItemEditor;

    const stuffs = mockStuffs[Number(event_id)];
    if (!stuffs) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    const index = stuffs.findIndex((s) => s.stuff_id === Number(stuff_id));
    if (index === -1) {
      return HttpResponse.json(
        { error: "Вещь с данным идентификатором не найдена" },
        { status: 404 }
      );
    }

    let responsibleName = stuffs[index].responsible_name;
    let responsibleSurname = stuffs[index].responsible_surname;

    if (stuffData.responsible_login !== undefined) {
      if (stuffData.responsible_login && mockUsers[stuffData.responsible_login]) {
        const user = mockUsers[stuffData.responsible_login];
        responsibleName = user.name;
        responsibleSurname = user.surname;
      } else {
        responsibleName = null;
        responsibleSurname = null;
      }
    }

    const updatedStuff = {
      ...stuffs[index],
      ...stuffData,
      responsible_name: responsibleName,
      responsible_surname: responsibleSurname,
    };

    stuffs[index] = updatedStuff;

    return HttpResponse.json(updatedStuff, { status: 200 });
  }),

  // Удалить вещь
  http.delete("/api/events/:event_id/stuffs-list/:stuff_id/delete-stuff", ({ params }) => {
    const { event_id, stuff_id } = params;

    const stuffs = mockStuffs[Number(event_id)];
    if (!stuffs) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    const initialLength = stuffs.length;
    mockStuffs[Number(event_id)] = stuffs.filter(
      (s) => s.stuff_id !== Number(stuff_id)
    );

    if (initialLength === mockStuffs[Number(event_id)].length) {
      return HttpResponse.json(
        { error: "Вещь с данным идентификатором не найдена" },
        { status: 404 }
      );
    }

    return new HttpResponse(null, { status: 200 });
  }),

  // Пользователь берет вещь
  http.patch("/api/events/:event_id/stuffs-list/:stuff_id/take-stuff", ({ params }) => {
    const { event_id, stuff_id } = params;
    const currentUser = mockUsers["current_user"];

    const stuffs = mockStuffs[Number(event_id)];
    if (!stuffs) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    const index = stuffs.findIndex((s) => s.stuff_id === Number(stuff_id));
    if (index === -1) {
      return HttpResponse.json(
        { error: "Вещь с данным идентификатором не найдена" },
        { status: 404 }
      );
    }

    const updatedStuff = {
      ...stuffs[index],
      responsible_login: currentUser.login,
      responsible_name: currentUser.name,
      responsible_surname: currentUser.surname,
    };
    
    stuffs[index] = updatedStuff;
     

    const response: StuffListItemResponsible = {
      stuff_id: updatedStuff.stuff_id,
      stuff_name: updatedStuff.stuff_name,
      responsible_login: updatedStuff.responsible_login,
      responsible_name: updatedStuff.responsible_name,
      responsible_surname: updatedStuff.responsible_surname,
      stuff_description: updatedStuff.stuff_description,
    };


    return HttpResponse.json(response, { status: 200 });
  }),
];
