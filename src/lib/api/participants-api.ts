import { api } from "./api";
import { User, UserDemo } from "./types/participants-types";

export const participantsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEventParticipantsList: builder.query<User[], number>({
      query: (event_id) => `/events/${event_id}/participants-list`,
      providesTags: ["ParticipantsList"],
    }),

    searchUsers: builder.query<
      UserDemo[],
      { event_id: number; text: string; seq: number }
    >({
      query: ({ event_id, text, seq }) => ({
        url: `/events/${event_id}/participants-list/add-participant`,
        params: { text, seq },
      }),
    }),

    addParticipants: builder.mutation<
      void,
      { event_id: number; logins: string[] }
    >({
      query: ({ event_id, logins }) => ({
        url: `/events/${event_id}/participants-list/add-participant`,
        method: "POST",
        body: logins,
      }),
      invalidatesTags: ["ParticipantsList"],
    }),
  }),
});

export const {
  useGetEventParticipantsListQuery,
  useSearchUsersQuery,
  useAddParticipantsMutation,
} = participantsApi;
