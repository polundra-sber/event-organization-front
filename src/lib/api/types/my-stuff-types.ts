export interface MyStuffListItem {
  stuff_id: number;
  name: string;
  description?: string;
  event_id: number;
  event_name: string;
}



export type EventNotExistResponse = {
  error: string;
  details?: {
    field: string;
    message: string;
  };
};