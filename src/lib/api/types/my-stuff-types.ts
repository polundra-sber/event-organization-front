export interface MyStuffListItem {
  stuff_id: number;
  stuff_name: string;
  stuff_description?: string;
  event_id: number;
  event_name: string;
}


export type EventNotExistResponse = {
  error: string;
};
