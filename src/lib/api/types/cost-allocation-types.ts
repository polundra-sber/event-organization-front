export type CostAllocationListItem = {
  purchase_id: number;
  purchase_name: string;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  cost: number;
  hasReceipt: boolean;
  countParticipants: number;
};

export type UserDemo = {
  login: string;
  email: string;
  name: string;
  surname: string;
};

export type ReceiptList = {
  files: Blob[];
};
