import { api } from "./api";
import { MyTaskListItem } from "@/lib/api/types/my-tasks-types";

export const myTasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyTasksList: builder.query<MyTaskListItem[], void>({
      query: () => `/my-tasks-list`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ task_id }) => ({
                type: "MyTask" as const,
                id: task_id,
              })),
              { type: "MyTask", id: "LIST" },
            ]
          : [{ type: "MyTask", id: "LIST" }],
    }),

    denyTaskInMyTasksList: builder.mutation<void, { task_id: number }>({
      query: ({  task_id }) => ({
        url: `/my-tasks-list/${task_id}/deny-task`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { task_id }) => [
        { type: "MyTask", id: task_id },
        { type: "MyTask", id: "LIST" },
      ],
    }),

    markTaskCompletedInMyTasksList: builder.mutation<void, {  task_id: number }>({
      query: ({ task_id }) => ({
        url: `/my-tasks-list/${task_id}/mark-task-completed`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, { task_id }) => [
        { type: "MyTask", id: task_id },
        { type: "MyTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyTasksListQuery,
  useDenyTaskInMyTasksListMutation,
  useMarkTaskCompletedInMyTasksListMutation,
} = myTasksApi;