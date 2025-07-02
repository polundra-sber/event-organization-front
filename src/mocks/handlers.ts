import { eventHandlers } from "./events";
import { authHandlers } from "./auth";
import { profileHandlers } from "./profile";
import { myStuffHandlers } from "./my-stuffs-mocks"
import { myTaskHandlers } from "./my-tasks-mocks";

export const handlers = [...myStuffHandlers, ...myTaskHandlers, ...eventHandlers, ...authHandlers, ...profileHandlers ];
