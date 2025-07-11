import { api } from "./api";
import {
  AddParticipantsRequest,
  User,
  UserDemo,
} from "./types/participants-types";

export const participantsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // список участников мероприятия
    getEventParticipantsList: builder.query<User[], number>({
      query: (event_id) => `/events/${event_id}/participants-list`,
      providesTags: ["ParticipantsList"],
    }),

    // поиск пользователей для добавлениея
    searchUsers: builder.query<
      UserDemo[],
      { event_id: number; text: string; seq: number }
    >({
      query: ({ event_id, text, seq }) => ({
        url: `/events/${event_id}/participants-list/add-participant`,
        params: { text, seq },
      }),
    }),

    // добавить участников
    addParticipants: builder.mutation<
      void,
      { event_id: number; logins: AddParticipantsRequest }
    >({
      query: ({ event_id, logins }) => ({
        url: `/events/${event_id}/participants-list/add-participant`,
        method: "POST",
        body: logins,
      }),
      invalidatesTags: ["ParticipantsList"],
    }),

    // удалить участника
    deleteParticipant: builder.mutation<
      void,
      { event_id: number; participant_login: string }
    >({
      query: ({ event_id, participant_login }) => ({
        url: `/events/${event_id}/participants-list/${participant_login}/delete-participant`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParticipantsList"],
    }),

    // Изменить роль участника
    updateParticipantRole: builder.mutation<
      { role: string },
      { event_id: number; participant_login: string }
    >({
      query: ({ event_id, participant_login }) => ({
        url: `/events/${event_id}/participants-list/${participant_login}/change-participant-role`,
        method: "PATCH",
      }),
      invalidatesTags: ["ParticipantsList"],
    }),
  }),
});

export const {
  useGetEventParticipantsListQuery,
  useSearchUsersQuery,
  useAddParticipantsMutation,
  useDeleteParticipantMutation,
  useUpdateParticipantRoleMutation,
} = participantsApi;
