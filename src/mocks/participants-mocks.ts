import { http, HttpResponse } from "msw";
import { User, UserDemo } from "@/lib/api/types/participants-types";

// Моковые данные для участников
const mockParticipants: Record<number, User[]> = {
  1: [
    {
      login: "user122222222222222222222222222222222222222222222222222222222222",
      email: "user122222222222222222222222222222222222222222222222222222222222@example.com",
      name: "Иванввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввв",
      surname: "Ивановввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввв",
      role_name: "организатор",
      password: null,
      comment_money_transfer: "НААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААА",
    },
    {
      login: "user2222222222222222222222222222222222222222222222222222222222222222222222222",
      email: "user2@exampleееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееее.com",
      name: "Марияяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяя",
      surname: "Петроваааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа",
      role_name: "участник",
      password: null,
      comment_money_transfer: "На сбер: 89996362576",
    },

    {
      login: "user553333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
      email: "user5533333333333333333333333333333333333333333333333333333333333333333333333333333333333333333@example.com",
      name: "Марияяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяя",
      surname: "заявка",
      role_name: "не допущен",
      password: null,
      comment_money_transfer: "На сбер: 89996362576",
    },
    {
      login: "userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      email: "userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr@example.com",
      name: "bosssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      surname: "Ивановвввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввв",
      role_name: "создатель",
      password: null,
      comment_money_transfer: null,
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
    login: "user1111111111111111111111111111111111111111111111111",
    email: "user1111111111111111111111111111111111111111111111111@example.com",
    name: "Иваннннннннннннннннннннннннннннннннннннннннннннннннннн",
    surname: "Ивановввввввввввввввввввввввввввввввввввввввввввввввввв",
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

  {
    login: "ivanov1",
    email: "ivanov1@example.com",
    name: "Иван",
    surname: "Иванов",
  },
  {
    login: "ivanov2",
    email: "ivanov2@example.com",
    name: "Иван",
    surname: "Ивановский",
  },
  {
    login: "ivanova1",
    email: "ivanova1@example.com",
    name: "Ирина",
    surname: "Иванова",
  },
  {
    login: "ivanova2",
    email: "ivanova2@example.com",
    name: "Инна",
    surname: "Иванова",
  },

  {
    login: "petrov1",
    email: "petrov1@example.com",
    name: "Петр",
    surname: "Петров",
  },
  {
    login: "petrova1",
    email: "petrova1@example.com",
    name: "Полина",
    surname: "Петрова",
  },
  {
    login: "petrova2",
    email: "petrova2@example.com",
    name: "Мария",
    surname: "Петрова",
  },

  {
    login: "sidorov1",
    email: "sidorov1@example.com",
    name: "Семен",
    surname: "Сидоров",
  },
  {
    login: "sidorova1",
    email: "sidorova1@example.com",
    name: "Светлана",
    surname: "Сидорова",
  },

  {
    login: "kuznetsov1",
    email: "kuznetsov1@example.com",
    name: "Константин",
    surname: "Кузнецов",
  },
  {
    login: "kuznetsova1",
    email: "kuznetsova1@example.com",
    name: "Ксения",
    surname: "Кузнецова",
  },

  {
    login: "smirnov1",
    email: "smirnov1@example.com",
    name: "Сергей",
    surname: "Смирнов",
  },
  {
    login: "smirnova1",
    email: "smirnova1@example.com",
    name: "Ольга",
    surname: "Смирнова",
  },
  {
    login: "smirnova2",
    email: "smirnova2@example.com",
    name: "Анна",
    surname: "Смирнова",
  },

  {
    login: "popov1",
    email: "popov1@example.com",
    name: "Павел",
    surname: "Попов",
  },
  {
    login: "fedorova1",
    email: "fedorova1@example.com",
    name: "Фаина",
    surname: "Федорова",
  },
  {
    login: "alexeev1",
    email: "alexeev1@example.com",
    name: "Алексей",
    surname: "Алексеев",
  },
  {
    login: "alexeeva1",
    email: "alexeeva1@example.com",
    name: "Алина",
    surname: "Алексеева",
  },
  {
    login: "mikhailov1",
    email: "mikhailov1@example.com",
    name: "Михаил",
    surname: "Михайлов",
  },
  {
    login: "mikhailova1",
    email: "mikhailova1@example.com",
    name: "Марина",
    surname: "Михайлова",
  },
  {
    login: "admin1",
    email: "admin1@example.com",
    name: "Админ",
    surname: "Админов",
  },
  {
    login: "testuser",
    email: "testuser@example.com",
    name: "Тест",
    surname: "Тестов",
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
        return HttpResponse.json([], { status: 200 }); // Пустой массив вместо ошибки
      }

      // Фильтрация пользователей по тексту поиска (регистронезависимая)
      const searchTextLower = text.toLowerCase();
      const filteredUsers = mockAllUsers
        .filter(
          (user) =>
            user.login.toLowerCase().includes(searchTextLower) ||
            user.name.toLowerCase().includes(searchTextLower) ||
            user.surname.toLowerCase().includes(searchTextLower) ||
            user.email.toLowerCase().includes(searchTextLower)
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
          role_name: "участник",
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

  http.patch(
    "/api/events/:event_id/participants-list/:participant_login/change-participant-role",
    ({ params }) => {
      const { event_id, participant_login } = params;

      if (!mockParticipants[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие не найдено" },
          { status: 404 }
        );
      }

      const participant = mockParticipants[event_id as unknown as number].find(
        (p) => p.login === participant_login
      );

      if (!participant) {
        return HttpResponse.json(
          { error: "Участник не найден" },
          { status: 404 }
        );
      }

      if (participant.role_name === "создатель") {
        return HttpResponse.json(
          { error: "Нельзя изменить роль создателя" },
          { status: 403 }
        );
      }

      const newRole =
        participant.role_name === "организатор" ? "участник" : "организатор";

      participant.role_name = newRole;

      return HttpResponse.json({ role: newRole }, { status: 200 });
    }
  ),
];
