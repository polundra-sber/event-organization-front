import { eventHandlers } from "./events-mocks";
import { authHandlers } from "./auth-mocks";
import { profileHandlers } from "./profile-mocks";
import { myStuffHandlers } from "./my-stuffs-mocks";
import { myTaskHandlers } from "./my-tasks-mocks";

export const handlers = [...myStuffHandlers, ...myTaskHandlers, ...eventHandlers, ...authHandlers, ...profileHandlers ];
