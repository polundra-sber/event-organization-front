export type PurchaseListItem = {
  purchase_id: number;
  purchase_name: string;
  purchase_description?: string | null;
  responsible_login?: string | null;
  responsible_name?: string | null;
  responsible_surname?: string | null;
};

export type PurchaseListItemCreator = {
  purchase_name: string;
  purchase_description?: string | null;
  responsible_login?: string | null;
};

export type PurchaseListItemEditor = {
  purchase_name?: string | null;
  purchase_description?: string | null;
  responsible_login?: string | null;
};

export type PurchaseListItemResponsible = {
  purchase_id: number;
  purchase_name: string;
  responsible_login: string;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  purchase_description?: string | null;
};
