export interface MyDebtListItem {
  event_id: number;
  event_name: string;
  debt_id: number;
  recipient_login: string;
  recipient_name: string;
  recipient_surname: string;
  comment_money_transfer: string;
  debt_status_name?: string | null;
  debt_amount: number;
}

export interface DebtNotExistResponse {
  error: string;
}
