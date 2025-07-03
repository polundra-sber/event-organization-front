import { api } from "./api";
import {
  Event,
  EventEditor,
  EventUserMetadata,
} from "@/lib/api/types/event-types";

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка мероприятий
    getEvents: builder.query<Event[], void>({
      query: () => "/events",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ event_id }) => ({
                type: "Event" as const,
                id: event_id,
              })),
              { type: "Event" as const, id: "LIST" },
            ]
          : [{ type: "Event" as const, id: "LIST" }],
    }),

    // Создание мероприятия
    createEvent: builder.mutation<Event, Partial<EventEditor>>({
      query: (eventData) => ({
        url: "/create_event",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    // Поиск мероприятия по ID
    findEvent: builder.query<Event, number>({
      query: (eventId) => `/find_event/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Запрос на присоединение к мероприятию
    joinEvent: builder.mutation<string, number>({
      query: (eventId) => ({
        url: `/join_event_request/${eventId}`,
        method: "POST",
      }),
    }),

    // Покинуть мероприятие
    leaveEvent: builder.mutation<string, number>({
      query: (eventId) => ({
        url: `/leave_event/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Удаление мероприятия (для создателя)
    deleteEvent: builder.mutation<string, number>({
      query: (eventId) => ({
        url: `/delete_event/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Завершение мероприятия
    completeEvent: builder.mutation<string, number>({
      query: (eventId) => ({
        url: `/complete_event/${eventId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Получение карточки мероприятия
    getEventById: builder.query<Event, number>({
      query: (eventId) => `/events/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Редактирование мероприятия
    editEvent: builder.mutation<
      EventEditor,
      { eventId: number; data: Partial<EventEditor> }
    >({
      query: ({ eventId, data }) => ({
        url: `/events/${eventId}/edit`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Event", id: eventId },
      ],
    }),

    // Получение метаданных пользователя по мероприятию
    getUserMetadata: builder.query<EventUserMetadata, number>({
      query: (event_id) => ({
        url: `/events/${event_id}/user-metadata`,
        method: "GET",
      }),
    }),
  }),
});

// Экспорт хуков
export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useFindEventQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useDeleteEventMutation,
  useCompleteEventMutation,
  useGetEventByIdQuery,
  useEditEventMutation,
  useGetUserMetadataQuery,
} = eventsApi;
