import { http, HttpResponse } from "msw";
import {
  TaskListItem,
  TaskListItemCreator,
  TaskListItemEditor,
  TaskListItemResponsible,
} from "@/lib/api/types/tasks-types";

// Моковые данные
const mockTasks: Record<
  number,
  { event_date: string; event_time: string; tasks: TaskListItem[] }
> = {
  1: {
    event_date: "15.06.2025",
    event_time: "18:00",
    tasks: [
      {
        task_id: 1,
        task_name: "Заказать торт",
        task_description: "Торт без орехов и без апельсина",
        task_status_name: "В работе",
        responsible_user: "user1",
        deadline_date: "12.06.2025",
        deadline_time: "16:00",
      },
      {
        task_id: 2,
        task_name: "Купить шарики",
        task_description: "Разноцветные, 20 штук",
        task_status_name: "Новая",
        responsible_user: "Не назначен",
        deadline_date: "10.06.2025",
      },
    ],
  },
  2: {
    event_date: "20.07.2025",
    event_time: "20:00",
    tasks: [
      {
        task_id: 3,
        task_name: "Забронировать ресторан",
        task_status_name: "Завершена",
        responsible_user: "user2",
        deadline_date: "01.05.2025",
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

    return HttpResponse.json(
      {
        event_date: eventTasks.event_date,
        event_time: eventTasks.event_time, // Добавлено в ответ
        tasks: eventTasks.tasks,
      },
      { status: 200 }
    );
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

      // Валидация обязательных полей
      if (!taskData.task_name) {
        return HttpResponse.json(
          { error: "Название задачи обязательно" },
          { status: 400 }
        );
      }

      const newTask: TaskListItem = {
        task_id: Math.max(0, ...eventTasks.tasks.map((t) => t.task_id)) + 1,
        task_name: taskData.task_name,
        task_description: taskData.task_description || "Описание не добавлено",
        task_status_name: taskData.task_status_name || "Новая",
        responsible_user: taskData.responsible_user || "Не назначен",
        deadline_date:
          taskData.deadline_date || new Date().toLocaleDateString("ru-RU"),
        deadline_time: taskData.deadline_time,
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

      const updatedTask = {
        ...eventTasks.tasks[taskIndex],
        ...taskData,
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
      const currentUser = "current_user";

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
        responsible_user: currentUser,
        task_status_name: "В работе",
      };

      eventTasks.tasks[taskIndex] = updatedTask;

      const response: TaskListItemResponsible = {
        task_id: updatedTask.task_id,
        task_name: updatedTask.task_name,
        responsible_user: updatedTask.responsible_user,
        task_description: updatedTask.task_description,
      };

      return HttpResponse.json(response, { status: 200 });
    }
  ),
];
