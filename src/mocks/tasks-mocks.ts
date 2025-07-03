import { http, HttpResponse } from "msw";
import {
  TaskListItem,
  TaskListItemCreator,
  TaskListItemEditor,
  TaskListItemResponsible,
} from "@/lib/api/types/tasks-types";

// Моковые данные для задач
const mockTasks: Record<number, TaskListItem[]> = {
  1: [
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
  2: [
    {
      task_id: 3,
      task_name: "Забронировать ресторан",
      task_status_name: "Завершена",
      responsible_user: "user2",
      deadline_date: "01.05.2025",
    },
  ],
};

export const taskHandlers = [
  // Получить список задач
  http.get("/api/events/:event_id/tasks-list", ({ params }) => {
    const { event_id } = params;
    const tasks = mockTasks[event_id as unknown as number];

    if (!tasks) {
      return HttpResponse.json(
        { error: "Мероприятие с данным идентификатором не найдено" },
        { status: 404 }
      );
    }

    return HttpResponse.json(tasks, { status: 200 });
  }),

  // Добавить новую задачу
  http.post(
    "/api/events/:event_id/tasks-list/add-tasks",
    async ({ request, params }) => {
      const { event_id } = params;
      const taskData = (await request.json()) as TaskListItemCreator;

      if (!mockTasks[event_id as unknown as number]) {
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
        task_id:
          Math.max(
            0,
            ...mockTasks[event_id as unknown as number].map((t) => t.task_id)
          ) + 1,
        task_name: taskData.task_name,
        task_description: taskData.task_description || "Описание не добавлено",
        task_status_name: taskData.task_status_name || "Новая",
        responsible_user: taskData.responsible_user || "Не назначен",
        deadline_date:
          taskData.deadline_date || new Date().toLocaleDateString("ru-RU"),
        deadline_time: taskData.deadline_time,
      };

      mockTasks[event_id as unknown as number].push(newTask);

      return HttpResponse.json(newTask, { status: 201 });
    }
  ),

  // Изменить задачу
  http.patch(
    "/api/events/:event_id/tasks-list/:task_id/edit-task",
    async ({ request, params }) => {
      const { event_id, task_id } = params;
      const taskData = (await request.json()) as TaskListItemEditor;

      if (!mockTasks[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const taskIndex = mockTasks[event_id as unknown as number].findIndex(
        (t) => t.task_id === Number(task_id)
      );

      if (taskIndex === -1) {
        return HttpResponse.json(
          { error: "Задача с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      const updatedTask = {
        ...mockTasks[event_id as unknown as number][taskIndex],
        ...taskData,
      };

      mockTasks[event_id as unknown as number][taskIndex] = updatedTask;

      return HttpResponse.json(updatedTask, { status: 200 });
    }
  ),

  // Удалить задачу
  http.delete(
    "/api/events/:event_id/tasks-list/:task_id/delete-task",
    ({ params }) => {
      const { event_id, task_id } = params;

      if (!mockTasks[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const initialLength = mockTasks[event_id as unknown as number].length;
      mockTasks[event_id as unknown as number] = mockTasks[
        event_id as unknown as number
      ].filter((t) => t.task_id !== Number(task_id));

      if (mockTasks[event_id as unknown as number].length === initialLength) {
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
      const currentUser = "current_user"; // Здесь можно добавить логику получения текущего пользователя

      if (!mockTasks[event_id as unknown as number]) {
        return HttpResponse.json(
          { error: "Мероприятие с данным идентификатором не найдено" },
          { status: 404 }
        );
      }

      const taskIndex = mockTasks[event_id as unknown as number].findIndex(
        (t) => t.task_id === Number(task_id)
      );

      if (taskIndex === -1) {
        return HttpResponse.json(
          { error: "Задача с данным идентификатором не найдена" },
          { status: 404 }
        );
      }

      const updatedTask = {
        ...mockTasks[event_id as unknown as number][taskIndex],
        responsible_user: currentUser,
      };

      mockTasks[event_id as unknown as number][taskIndex] = updatedTask;

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
