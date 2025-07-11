import { http, HttpResponse } from "msw";
import { MyPurchaseListItem } from "@/lib/api/types/my-purchases-types";

let myMockPurchases: MyPurchaseListItem[] = [
  {
    event_id: 1,
    event_name: "Шашлыки",
    purchase_id: 1,
    purchase_name: "Огурцы",
    responsible_login: "hello",
    responsible_name: "Вася",
    responsible_surname: "Пупкин",
    cost: 100,
    purchase_description: "Купить свежие, 2 кг",
    has_receipt: true,
  },
  {
    event_id: 1,
    event_name: "Шашлыки",
    purchase_id: 2,
    purchase_name: "Мясо",
    responsible_login: "hello2",
    responsible_name: "Петя",
    responsible_surname: "Иванов",
    cost: 0,
    has_receipt: false,
  },
];

export const myPurchasesHandlers = [
  http.get("/api/my-purchases-list", () => {
    return HttpResponse.json(
      {
        user_login: "hello",
        purchases: myMockPurchases,
      },
      { status: 200 }
    );
  }),

  http.patch(
    "/api/my-purchases-list/:purchase_id/edit-purchase-cost",
    async ({ params, request }) => {
      const { purchase_id } = params;
      const { cost } = await request.json(); // Получаем только cost из тела запроса
      const purchase = myMockPurchases.find(
        (p) => p.purchase_id === Number(purchase_id)
      );

      if (purchase) {
        purchase.cost = cost;
        return HttpResponse.json({}, { status: 200 });
      }
      return HttpResponse.json(
        { error: "Покупка не найдена" },
        { status: 404 }
      );
    }
  ),

  http.delete(
    "/api/my-purchases-list/:purchase_id/deny-purchase",
    ({ params }) => {
      const { purchase_id } = params;
      myMockPurchases = myMockPurchases.filter(
        (p) => p.purchase_id !== Number(purchase_id)
      );
      return HttpResponse.json({}, { status: 200 });
    }
  ),

  http.post(
    "/api/my-purchases-list/:purchase_id/add-receipt",
    async ({ params }) => {
      const { purchase_id } = params;
      const purchase = myMockPurchases.find(
        (p) => p.purchase_id === Number(purchase_id)
      );
      if (purchase) {
        purchase.has_receipt = true;
        return HttpResponse.json({}, { status: 201 });
      }
      return HttpResponse.json(
        { error: "Мероприятие или покупка не найдена" },
        { status: 404 }
      );
    }
  ),

  http.get(
    "/api/events/:event_id/purchases-list/:purchase_id/get-receipt",
    async () => {
      // Создаем реальные Blob из Base64
      const base64ToBlob = (base64: string, type: string) => {
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type });
      };

      // Простое 1x1 пиксельное изображение PNG
      const mockImage =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const blob1 = base64ToBlob(
        `data:image/png;base64,${mockImage}`,
        "image/png"
      );
      const file1 = new File([blob1], "receipt1.png", { type: "image/png" });
      const file2 = new File([blob1], "receipt2.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("file", file1);
      formData.append("file", file2);

      return new Response(formData);
    }
  ),
];
