import { eventHandlers } from "./events";
import { authHandlers } from "./auth";
import { profileHandlers } from "./profile";

export const handlers = [...eventHandlers, ...authHandlers, ...profileHandlers];
