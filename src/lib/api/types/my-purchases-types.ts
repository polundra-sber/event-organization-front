export interface MyPurchaseListItem {
  event_id: number;
  event_name: string;
  purchase_id: number;
  purchase_name: string;
  responsible_name: string;
  responsible_surname: string;
  responsible_login: string;
  cost: number;
  purchase_description?: string;
  has_receipt: boolean;
}

export interface MyPurchasesListResponse {
  user_login: string;
  purchases: MyPurchaseListItem[];
}

export interface ReceiptList {
  files: File[]; // массив бинарных файлов
}

export interface EventNotExistResponse {
  error: string;
}

export interface EditPurchaseCostRequest {
  cost: number;
}
