import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// инициализируем только в браузере
if (typeof window !== "undefined") {
  const worker = setupWorker(...handlers);
  worker.start({
    onUnhandledRequest: "bypass", // Игнорируем незамоканные запросы
  });
}

export {};
