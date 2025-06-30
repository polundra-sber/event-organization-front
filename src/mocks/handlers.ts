import { eventHandlers } from "./events";
import { authHandlers } from "./auth";

export const handlers = [...eventHandlers, ...authHandlers];
