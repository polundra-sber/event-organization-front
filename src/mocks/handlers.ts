import { eventHandlers } from "./events-mocks";
import { authHandlers } from "./auth-mocks";
import { profileHandlers } from "./profile-mocks";
import { myStuffHandlers } from "./my-stuffs-mocks";
import { myTaskHandlers } from "./my-tasks-mocks";
import { myDebtHandlers } from "./my-debts-mocks";
import { myIncomesHandlers } from "./my-incomes-mocks";
import { taskHandlers } from "./tasks-mocks";
import { participantsHandlers } from "./participants-mocks";
import { stuffHandlers } from "./stuffs-mocks";

import { purchaseHandlers } from "./purchases-mocks";
import { costAllocationHandlers } from "./cost-allocation-mocks";

import { costHandlers } from "./cost-mocks";

export const handlers = [
  ...myStuffHandlers,
  ...myTaskHandlers,
  ...myDebtHandlers,
  ...myIncomesHandlers,
  ...eventHandlers,
  ...authHandlers,
  ...profileHandlers,
  ...taskHandlers,
  ...stuffHandlers,
  ...participantsHandlers,
  ...purchaseHandlers,
  ...costAllocationHandlers,
  ...costHandlers
];
