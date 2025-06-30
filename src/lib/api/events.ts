import { api } from "./api";
import { Event } from "@/lib/api/types/event-types";

export const { useGetEventsQuery } = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение мероприятий
    getEvents: builder.query<Event[], void>({
      query: () => "/events",
    }),
  }),
});
