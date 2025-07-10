export interface MyTaskListItem {
  task_id: number;
  event_id: number;
  event_name: string;
  task_name: string;
  task_description?: string | null;
  deadline_date: string;
  deadline_time?: string;
  task_status_name: string;
}

export interface TaskNotExistResponse {
  error: string;
}