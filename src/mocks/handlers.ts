import { eventHandlers } from "./events";
import { authHandlers } from "./auth";
import { profileHandlers } from "./profile";
import { myStuffHandlers } from "./my-stuffs-mocks"

export const handlers = [...myStuffHandlers, ...eventHandlers, ...authHandlers, ...profileHandlers ];
