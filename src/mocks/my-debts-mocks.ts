import { http, HttpResponse } from "msw";
import { MyDebtListItem } from "@/lib/api/types/my-debts-types";

let myMockDebts: MyDebtListItem[] = [
  {
    event_id: 1,
    event_name: "Шашлыки",
    debt_id: 1,
    recipient_login: "user1",
    recipient_name: "Алексей",
    recipient_surname: "Иванов",
    comment_money_transfer: "Банковская карта: 1234 5678 9012 3456999999999999999999999999999999999999999",
    debt_status_name: "не оплачен",
    debt_amount: 500.0,
  },
  {
    event_id: 1,
    event_name: "Шашлыки",
    debt_id: 2,
    recipient_login: "user2",
    recipient_name: "Иван",
    recipient_surname: "Иванов",
    comment_money_transfer: "Тинькофф",
    debt_status_name: "не оплачен",
    debt_amount: 750.0,
  },
];

export const myDebtHandlers = [
  // Получить список долгов
  http.get("/api/my-debts-list", () => {
    return HttpResponse.json(myMockDebts, { status: 200 });
  }),

  // Отметить долг оплаченным
  http.patch(
    "/api/my-debts-list/:debt_id/mark-debt-paid",
    ({ params }) => {
      const { debt_id } = params;
      const debtIdNum = Number(debt_id);

      const debt = myMockDebts.find((d) => d.debt_id === debtIdNum);

      if (debt) {
        debt.debt_status_name = "оплачен";
        return HttpResponse.json(debt, { status: 200 });
      }
      return HttpResponse.json({ error: "Долг не найден" }, { status: 404 });
    }
  ),
];
