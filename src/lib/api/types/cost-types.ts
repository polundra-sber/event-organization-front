export interface CostAllocationListItem {
  purchase_id: number;
  purchase_name: string;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  cost: number;
  hasReceipt: boolean;
  countParticipants: number;
}

export interface CostListResponse {
  cost_allocation_list: CostAllocationListItem[];
  expenses_existence: boolean;
}

export interface UserDemo {
  login: string;
  email: string;
  name: string;
  surname: string;
}

export interface ReceiptList {
  files: File[];
}

export interface EventNotExistResponse {
  error: string;
}