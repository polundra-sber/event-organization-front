export type Event = {
  event_id: number;
  event_name: string;
  event_date: string;
  role_name: string;
  event_description?: string;
  event_status_name?: string;
  location?: string;
  event_time?: string;
  chat_link?: string;
};

export type EventEditor = {
  event_name?: string;
  event_description?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
  chat_link?: string;
};

export type EventRole = "участник" | "организатор" | "создатель";
export type EventStatus = "активно" | "завершено";
