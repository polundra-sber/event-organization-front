import { http, HttpResponse } from "msw";
import {
  TaskListItem,
  TaskListItemCreator,
  TaskListItemEditor,
  TaskListItemResponsible,
} from "@/lib/api/types/tasks-types";
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

// Моковые данные задач
const mockTasks: Record<
  number,
  { event_date: string; event_time: string | null; tasks: TaskListItem[] }
> = {
  1: {
    event_date: "2025-07-15",
    event_time: "18:00",
    tasks: [
      {
        task_id: 1,
        task_name: "Заказать торт",
        task_description: "Торт без орехов и без апельсина",
        task_status_name: "В работе",
        responsible_login: "user1",
        responsible_name: "Иван",
        responsible_surname: "Иванов",
        deadline_date: "2025-07-15",
        deadline_time: "16:00",
      },
      {
        task_id: 2,
        task_name: "Купить шарики",
        task_description: "Разноцветные, 20 штук",
        task_status_name: "Новая",
        responsible_login: null,
        responsible_name: null,
        responsible_surname: null,
        deadline_date: "2025-06-10",
        deadline_time: null,
      },
    ],
  },
  2: {
    event_date: "2025-07-20",
    event_time: null,
    tasks: [
      {
        task_id: 3,
        task_name: "Забронировать ресторан",
        task_status_name: "Завершена",
        responsible_login: "user2",
        responsible_name: "Мария",
        responsible_surname: "Петрова",
        deadline_date: "2025-05-01",
        deadline_time: null,
      },
    ],
  },
};

export const taskHandlers = [
  // Список задач
  http.get("/api/events/:event_id/tasks-list", ({ params }) => {
    const { event_id } = params;
    const eventTasks = mockTasks[event_id as unknown as number];

    if (!eventTasks) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(eventTasks, { status: 200 });
  }),

  // Добавить новую задачу
  http.post(
    "/api/events/:event_id/tasks-list/add-tasks",
    async ({ request, params }) => {
      const { event_id } = params;
      const taskData = (await request.json()) as TaskListItemCreator;

      const eventTasks = mockTasks[event_id as unknown as number];
      if (!eventTasks) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      if (!taskData.task_name) {
        return HttpResponse.json(
          { error: "Название задачи обязательно" },
          { status: 400 }
        );
      }

      // Находим данные пользователя, если указан responsible_login
      let responsibleName = null;
      let responsibleSurname = null;

      if (taskData.responsible_login && mockUsers[taskData.responsible_login]) {
        const user = mockUsers[taskData.responsible_login];
        responsibleName = user.name;
        responsibleSurname = user.surname;
      }

      const newTask: TaskListItem = {
        task_id: Math.max(0, ...eventTasks.tasks.map((t) => t.task_id)) + 1,
        task_name: taskData.task_name,
        task_description: taskData.task_description || null,
        task_status_name: taskData.task_status_name || "Новая",
        responsible_login: taskData.responsible_login || null,
        responsible_name: responsibleName,
        responsible_surname: responsibleSurname,
        deadline_date:
          taskData.deadline_date || new Date().toISOString().split("T")[0],
        deadline_time: taskData.deadline_time || null,
      };

      eventTasks.tasks.push(newTask);

      return HttpResponse.json(newTask, { status: 201 });
    }
  ),

  // Изменить задачу
  http.patch(
    "/api/events/:event_id/tasks-list/:task_id/edit-task",
    async ({ request, params }) => {
      const { event_id, task_id } = params;
      const taskData = (await request.json()) as TaskListItemEditor;

      const eventTasks = mockTasks[event_id as unknown as number];
      if (!eventTasks) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const taskIndex = eventTasks.tasks.findIndex(
        (t) => t.task_id === Number(task_id)
      );

      if (taskIndex === -1) {
        return HttpResponse.json(
          { error: "Задача с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      // Находим данные пользователя, если указан responsible_login
      let responsibleName = eventTasks.tasks[taskIndex].responsible_name;
      let responsibleSurname = eventTasks.tasks[taskIndex].responsible_surname;

      if (taskData.responsible_login !== undefined) {
        if (
          taskData.responsible_login &&
          mockUsers[taskData.responsible_login]
        ) {
          const user = mockUsers[taskData.responsible_login];
          responsibleName = user.name;
          responsibleSurname = user.surname;
        } else {
          responsibleName = null;
          responsibleSurname = null;
        }
      }

      const updatedTask = {
        ...eventTasks.tasks[taskIndex],
        ...taskData,
        responsible_name: responsibleName,
        responsible_surname: responsibleSurname,
      };

      eventTasks.tasks[taskIndex] = updatedTask;

      return HttpResponse.json(updatedTask, { status: 200 });
    }
  ),

  // Удалить задачу
  http.delete(
    "/api/events/:event_id/tasks-list/:task_id/delete-task",
    ({ params }) => {
      const { event_id, task_id } = params;

      const eventTasks = mockTasks[event_id as unknown as number];
      if (!eventTasks) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const initialLength = eventTasks.tasks.length;
      eventTasks.tasks = eventTasks.tasks.filter(
        (t) => t.task_id !== Number(task_id)
      );

      if (eventTasks.tasks.length === initialLength) {
        return HttpResponse.json(
          { error: "Задача с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // Пользователь берет задачу
  http.patch(
    "/api/events/:event_id/tasks-list/:task_id/take-task",
    async ({ params }) => {
      const { event_id, task_id } = params;
      const currentUser = mockUsers["current_user"];

      const eventTasks = mockTasks[event_id as unknown as number];
      if (!eventTasks) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const taskIndex = eventTasks.tasks.findIndex(
        (t) => t.task_id === Number(task_id)
      );

      if (taskIndex === -1) {
        return HttpResponse.json(
          { error: "Задача с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      const updatedTask = {
        ...eventTasks.tasks[taskIndex],
        responsible_login: currentUser.login,
        responsible_name: currentUser.name,
        responsible_surname: currentUser.surname,
        task_status_name: "В работе",
      };

      eventTasks.tasks[taskIndex] = updatedTask;

      const response: TaskListItemResponsible = {
        task_id: updatedTask.task_id,
        task_name: updatedTask.task_name,
        responsible_login: updatedTask.responsible_login,
        responsible_name: updatedTask.responsible_name,
        responsible_surname: updatedTask.responsible_surname,
        task_description: updatedTask.task_description,
      };

      return HttpResponse.json(response, { status: 200 });
    }
  ),
];
