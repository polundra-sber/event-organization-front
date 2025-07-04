import { eventHandlers } from "./events-mocks";
import { authHandlers } from "./auth-mocks";
import { profileHandlers } from "./profile-mocks";
import { myStuffHandlers } from "./my-stuffs-mocks";
import { myTaskHandlers } from "./my-tasks-mocks";
import { myDebtHandlers } from "./my-debts-mocks";
import { myIncomesHandlers } from "./my-incomes-mocks";

export const handlers = [...myStuffHandlers, ...myTaskHandlers, ...myDebtHandlers, ...myIncomesHandlers, ...eventHandlers, ...authHandlers, ...profileHandlers ];
