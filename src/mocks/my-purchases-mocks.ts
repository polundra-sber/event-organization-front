import { http, HttpResponse } from "msw";
import { MyPurchaseListItem } from "@/lib/api/types/my-purchases-types";



let myMockPurchases: MyPurchaseListItem[] = [
  {
    event_id: 1,
    event_name: "Шашлыки",
    purchase_id: 1,
    purchase_name: "Огурцы",
    responsible_id: 123,
    responsible_name: "Вася",
    responsible_surname: "Пупкин",
    cost: 100,
    purchase_description: "Купить свежие, 2 кг",
    has_receipt: false,
  },
  {
    event_id: 1,
    event_name: "Шашлыки",
    purchase_id: 2,
    purchase_name: "Мясо",
    responsible_id: 124,
    responsible_name: "Петя",
    responsible_surname: "Иванов",
    cost: 0,
    has_receipt: false,
  },
];


export const myPurchasesHandlers = [
  http.get("/api/events/my-purchases-list", () => {
    return HttpResponse.json(
      {
        myId: 124,
        purchases: myMockPurchases,
      },
      { status: 200 }
    );
  }),

    http.patch("/api/events/:event_id/my-purchases-list/:purchase_id/edit-purchase-cost", 
    async ({ params, request }) => {
    const { purchase_id } = params;
    const { cost } = await request.json(); // Получаем только cost из тела запроса
    const purchase = myMockPurchases.find(p => p.purchase_id === Number(purchase_id));
    
    if (purchase) {
        purchase.cost = cost;
        return HttpResponse.json({}, { status: 200 });
    }
    return HttpResponse.json({ error: "Покупка не найдена" }, { status: 404 });
    }),

  http.delete("/api/events/:event_id/my-purchases-list/:purchase_id/deny-purchase", ({ params }) => {
    const { purchase_id } = params;
    myMockPurchases = myMockPurchases.filter(p => p.purchase_id !== Number(purchase_id));
    return HttpResponse.json({}, { status: 200 });
  }),

  http.post("/api/events/:event_id/my-purchases-list/:purchase_id/add-receipt", async ({ params }) => {
    const { purchase_id } = params;
    const purchase = myMockPurchases.find(p => p.purchase_id === Number(purchase_id));
    if (purchase) {
      purchase.has_receipt = true;
      return HttpResponse.json({}, { status: 201 });
    }
    return HttpResponse.json({ error: "Мероприятие или покупка не найдена" }, { status: 404 });
  }),

 http.get("/api/events/:event_id/purchases-list/:purchase_id/get-receipt", async () => {
  const mockFile = new File(['mock image binary'], 'receipt.jpg', { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('files', mockFile);

  return new HttpResponse(formData, {
    status: 200,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}),

];
