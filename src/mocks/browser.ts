import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Важно: инициализируем только в браузере
if (typeof window !== "undefined") {
  const worker = setupWorker(...handlers);
  worker.start({
    onUnhandledRequest: "bypass", // Игнорируем незамоканные запросы
  });
}

export {};
