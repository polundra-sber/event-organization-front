import { http, HttpResponse } from "msw";
import { MyTaskListItem } from "@/lib/api/types/my-tasks-types";

let myMockTasks: MyTaskListItem[] = [
  {
    task_id: 1,
    event_id: 1,
    event_name: "Шашлыки",
    task_name: "Закупить воду",
    task_description: "20 бутылок по 0.5л",
    deadline_date: "12.06.2025",
    deadline_time: "16:00",
    task_status_name: "не выполнена",
  },
  {
    task_id: 2,
    event_id: 1,
    event_name: "Шашлыки",
    task_name: "Заказать еду",
    deadline_date: "12.06.2025",
    task_status_name: "не выполнена",
  },
  {
    task_id: 3,
    event_id: 2,
    event_name: "Корпоратив",
    task_name: "Организовать музыку",
    deadline_date: "20.06.2025",
    task_status_name: "выполнена",
  },
];

export const myTaskHandlers = [
  // Получить список всех задач пользователя
  http.get("/api/events/my-tasks-list", () => {
    return HttpResponse.json(myMockTasks, { status: 200 });
  }),

  // Отказаться от задачи
  http.delete(
    "/api/events/my-tasks-list/:task_id/deny-task",
    ({ params }) => {
      const { task_id } = params;
      const taskIdNum = Number(task_id);

      const taskIndex = myMockTasks.findIndex((t) => t.task_id === taskIdNum);

      if (taskIndex >= 0) {
        myMockTasks.splice(taskIndex, 1);
        return HttpResponse.json({ detail: "Задача удалена" }, { status: 200 });
      }
      return HttpResponse.json({ detail: "Задача не найдена" }, { status: 404 });
    }
  ),

  // Отметить задачу выполненной
  http.patch(
    "/api/events/my-tasks-list/:task_id/mark-task-completed",
    ({ params }) => {
      const { task_id } = params;
      const taskIdNum = Number(task_id);

      const task = myMockTasks.find((t) => t.task_id === taskIdNum);

      if (task) {
        task.task_status_name = "выполнена";
        return HttpResponse.json(task, { status: 200 });
      }
      return HttpResponse.json({ detail: "Задача не найдена" }, { status: 404 });
    }
  ),
];