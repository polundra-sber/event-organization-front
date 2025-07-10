export interface MyIncomeListItem {
  event_id: number;
  event_name: string;
  debt_id: number;
  payer_login: string;
  payer_name: string;
  payer_surname: string;
  debt_status_name?: string | null;
  debt_amount: number;
}

export interface DebtNotExistResponse {
  error: string;
}