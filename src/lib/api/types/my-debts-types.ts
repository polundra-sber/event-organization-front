export interface MyDebtListItem {
  event_id: number;
  event_name: string;
  debt_id: number;
  recipient_id: number;
  recipient_name: string;
  comment_money_transfer: string;
  debt_status_name: string;
  debt_amount: number;
}

export interface EventNotExistResponse {
  error: string;
}
