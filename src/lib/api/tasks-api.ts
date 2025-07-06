import { api } from "./api";
import {
  TaskListItem,
  TaskListItemCreator,
  TaskListItemEditor,
  TaskListItemResponsible,
} from "@/lib/api/types/tasks-types";

export const {
  useGetTasksListQuery,
  useAddTaskToTasksListMutation,
  useEditTaskInTasksListMutation,
  useDeleteTaskFromTasksListMutation,
  useTakeTaskFromTasksListMutation,
} = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить список задач
    getTasksList: builder.query<
      {
        event_date: string;
        event_time: string | null;
        tasks: TaskListItem[];
      },
      number
    >({
      query: (event_id) => ({
        url: `/events/${event_id}/tasks-list`,
        method: "GET",
      }),
      providesTags: (result, error, event_id) => [
        { type: "TaskList", id: event_id },
      ],
    }),

    // Добавить новую задачу
    addTaskToTasksList: builder.mutation<
      TaskListItem,
      { event_id: number; taskData: TaskListItemCreator }
    >({
      query: ({ event_id, taskData }) => ({
        url: `/events/${event_id}/tasks-list/add-tasks`,
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "TaskList", id: event_id },
      ],
    }),

    // Изменить задачу
    editTaskInTasksList: builder.mutation<
      TaskListItem,
      { event_id: number; task_id: number; taskData: TaskListItemEditor }
    >({
      query: ({ event_id, task_id, taskData }) => ({
        url: `/events/${event_id}/tasks-list/${task_id}/edit-task`,
        method: "PATCH",
        body: taskData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "TaskList", id: event_id },
      ],
    }),

    // Удалить задачу
    deleteTaskFromTasksList: builder.mutation<
      void,
      { event_id: number; task_id: number }
    >({
      query: ({ event_id, task_id }) => ({
        url: `/events/${event_id}/tasks-list/${task_id}/delete-task`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "TaskList", id: event_id },
      ],
    }),

    // Пользователь берет задачу
    takeTaskFromTasksList: builder.mutation<
      TaskListItemResponsible,
      { event_id: number; task_id: number }
    >({
      query: ({ event_id, task_id }) => ({
        url: `/events/${event_id}/tasks-list/${task_id}/take-task`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "TaskList", id: event_id },
      ],
    }),
  }),
});
