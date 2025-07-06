export type TaskListItem = {
  task_id: number;
  task_name: string;
  task_status_name: string;
  deadline_date: string;
  task_description?: string | null;
  responsible_login?: string | null;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  deadline_time?: string | null;
};

export type TaskListItemCreator = {
  task_name: string;
  task_description?: string | null;
  task_status_name?: string | null;
  responsible_login?: string | null;
  deadline_date?: string | null;
  deadline_time?: string | null;
};

export type TaskListItemEditor = {
  task_name?: string | null;
  task_description?: string | null;
  task_status_name?: string | null;
  responsible_login?: string | null;
  deadline_date?: string | null;
  deadline_time?: string | null;
};

export type TaskListItemResponsible = {
  task_id: number;
  task_name: string;
  responsible_login: string;
  responsible_name?: string | null;
  responsible_surname?: string | null;
  task_description?: string | null;
};
