import { http, HttpResponse } from "msw";
import { User, UserDemo } from "@/lib/api/types/participants-types";

// Моковые данные для участников
const mockParticipants: Record<number, User[]> = {
  1: [
    {
      login: "user1",
      email: "user1@example.com",
      name: "Иван",
      surname: "Иванов",
      role_name: "Организатор",
      password: null,
      comment_money_transfer: null,
    },
    {
      login: "user2",
      email: "user2@example.com",
      name: "Мария",
      surname: "Петрова",
      role_name: "Участник",
      password: null,
      comment_money_transfer: "На сбер: 89996362576",
    },
  ],
  2: [
    {
      login: "user3",
      email: "user3@example.com",
      name: "Алексей",
      surname: "Сидоров",
      role_name: "участник",
      password: null,
      comment_money_transfer: null,
    },
  ],
};

// Моковые данные для поиска пользователей
const mockAllUsers: UserDemo[] = [
  {
    login: "user1",
    email: "user1@example.com",
    name: "Иван",
    surname: "Иванов",
  },
  {
    login: "user2",
    email: "user2@example.com",
    name: "Мария",
    surname: "Петрова",
  },
  {
    login: "user3",
    email: "user3@example.com",
    name: "Алексей",
    surname: "Сидоров",
  },
  {
    login: "user4",
    email: "user4@example.com",
    name: "Ольга",
    surname: "Смирнова",
  },
];

export const participantsHandlers = [
  // Получить список участников мероприятия
  http.get("/api/events/:event_id/participants-list", ({ params }) => {
    const { event_id } = params;
    const participants = mockParticipants[event_id as unknown as number];

    if (!participants) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 410 }
      );
    }

    return HttpResponse.json(participants, { status: 200 });
  }),

  // Поиск пользователей для добавления
  http.get(
    "/api/events/:event_id/participants-list/add-participant",
    ({ request, params }) => {
      const { event_id } = params;
      const url = new URL(request.url);
      const text = url.searchParams.get("text") || "";
      const seq = Number(url.searchParams.get("seq")) || 0;

      if (!mockParticipants[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      if (!text) {
        return HttpResponse.json(
          { error: "Текст поиска обязателен" },
          { status: 400 }
        );
      }

      // Фильтрация пользователей по тексту поиска
      const filteredUsers = mockAllUsers
        .filter(
          (user) =>
            user.login.includes(text) ||
            user.name.includes(text) ||
            user.surname.includes(text)
        )
        // Исключаем уже добавленных участников
        .filter(
          (user) =>
            !mockParticipants[event_id as unknown as number].some(
              (participant) => participant.login === user.login
            )
        );

      // Пагинация - возвращаем по 10 пользователей
      const start = seq * 10;
      const end = start + 10;
      const result = filteredUsers.slice(start, end);

      return HttpResponse.json(result, { status: 200 });
    }
  ),

  // Добавить участников
  http.post(
    "/api/events/:event_id/participants-list/add-participant",
    async ({ request, params }) => {
      const { event_id } = params;
      const logins = (await request.json()) as string[];

      if (!mockParticipants[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      if (!logins || logins.length === 0) {
        return HttpResponse.json(
          { error: "Список логинов обязателен" },
          { status: 400 }
        );
      }

      // Валидация логинов
      const invalidLogins = logins.filter(
        (login) => !mockAllUsers.some((user) => user.login === login)
      );

      if (invalidLogins.length > 0) {
        return HttpResponse.json(
          { error: "Найдены несуществующие логины", invalidLogins },
          { status: 400 }
        );
      }

      // Добавляем пользователей
      const newParticipants = mockAllUsers
        .filter((user) => logins.includes(user.login))
        .map((user) => ({
          ...user,
          role_name: "Участник", // Устанавливаем роль по умолчанию
          password: null,
          comment_money_transfer: null,
        }));

      mockParticipants[event_id as unknown as number].push(...newParticipants);

      return HttpResponse.json(
        {
          message: "Участники успешно добавлены",
          count: newParticipants.length,
        },
        { status: 200 }
      );
    }
  ),

  // Удалить участника
  http.delete(
    "/api/events/:event_id/participants-list/:participant_login/delete-participant",
    ({ params }) => {
      const { event_id, participant_login } = params;

      if (!mockParticipants[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const initialLength =
        mockParticipants[event_id as unknown as number].length;
      mockParticipants[event_id as unknown as number] = mockParticipants[
        event_id as unknown as number
      ].filter((user) => user.login !== participant_login);

      if (
        mockParticipants[event_id as unknown as number].length === initialLength
      ) {
        return HttpResponse.json(
          { error: "Участник с данным логином не найден" },
          { status: 404 }
        );
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),
];
