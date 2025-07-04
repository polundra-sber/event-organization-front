import { http, HttpResponse } from "msw";
import { MyIncomeListItem } from "@/lib/api/types/my-incomes-types";

export const myMockIncomes: MyIncomeListItem[] = [
  {
    event_id: 1,
    event_name: "Шашлыки",
    debt_id: 10,
    payer_id: 5,
    payer_name: "Вася",
    debt_status_name: "не оплачен",
    debt_amount: 1500,
  },
  {
    event_id: 1,
    event_name: "Шашлыки",
    debt_id: 11,
    payer_id: 6,
    payer_name: "Петя",
    debt_status_name: "оплачен",
    debt_amount: 2000,
  },
  {
    event_id: 2,
    event_name: "Поход",
    debt_id: 12,
    payer_id: 7,
    payer_name: "Катя",
    debt_status_name: "получен",
    debt_amount: 1000,
  },
];

export const myIncomesHandlers = [
  http.get("/api/events/my-incomes-list", () => {
    return HttpResponse.json(myMockIncomes, { status: 200 });
  }),

  http.patch(
    "/api/events/:event_id/my-incomes-list/:debt_id/mark-income-received",
    ({ params }) => {
      const { event_id, debt_id } = params;
      const debtIdNum = Number(debt_id);
      const eventIdNum = Number(event_id);

      const income = myMockIncomes.find(
        (i) => i.debt_id === debtIdNum && i.event_id === eventIdNum
      );

      if (!income) {
        return HttpResponse.json(
          { error: "Мероприятие или долг не найден" },
          { status: 404 }
        );
      }

      income.debt_status_name = "получен";
      return HttpResponse.json(income, { status: 200 });
    }
  ),
];
