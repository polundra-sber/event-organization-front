import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const worker = setupWorker(...handlers);
  worker.start({
    onUnhandledRequest: "bypass", // Игнорируем незамоканные запросы
  });
}

export {};
