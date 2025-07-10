export type StuffListItem = {
  stuff_id: number;
  stuff_name: string;
  stuff_description?: string | null;
  responsible_login?: string | null;
  responsible_name?: string | null;
  responsible_surname?: string | null;
};

export type StuffListItemCreator = {
  stuff_name: string;
  stuff_description?: string | null;
  responsible_login?: string | null;
};

export type StuffListItemEditor = {
  stuff_name?: string | null;
  stuff_description?: string | null;
  responsible_login?: string | null;
};

export type StuffListItemResponsible = {
  stuff_id: number;
  stuff_name: string;
  responsible_login: string;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  stuff_description?: string | null;
};