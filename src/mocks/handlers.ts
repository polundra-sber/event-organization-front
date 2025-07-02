import { eventHandlers } from "./events-mocks";
import { authHandlers } from "./auth-mocks";
import { profileHandlers } from "./profile-mocks";
import { myStuffHandlers } from "./my-stuffs-mocks";

export const handlers = [
  ...myStuffHandlers,
  ...eventHandlers,
  ...authHandlers,
  ...profileHandlers,
];
