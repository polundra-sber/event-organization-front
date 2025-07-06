export interface MyIncomeListItem {
  event_id: number;
  event_name: string;
  debt_id: number;
  payer_id: number;
  payer_name: string;
  debt_status_name: "не оплачен" | "оплачен" | "получен";
  debt_amount: number;
}

export interface EventNotExistResponse {
  error: string;
}