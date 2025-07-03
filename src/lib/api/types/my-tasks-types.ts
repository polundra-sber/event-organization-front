export interface MyTaskListItem {
  task_id: number;
  event_id: number;
  event_name: string;
  task_name: string;
  task_description?: string;
  deadline_date: string;
  deadline_time?: string;
  task_status_name: string;
}

export interface EventNotExistResponse {
  detail: string;
}