export type TaskListItem = {
  task_id: number;
  task_name: string;
  task_status_name: string;
  deadline_date: string;
  task_description?: string;
  responsible_user?: string;
  deadline_time?: string;
};

export type TaskListItemCreator = {
  task_name: string;
  task_description?: string;
  task_status_name?: string;
  responsible_user?: string;
  deadline_date?: string;
  deadline_time?: string;
};

export type TaskListItemEditor = {
  task_name?: string;
  task_description?: string;
  task_status_name?: string;
  responsible_user?: string;
  deadline_date?: string;
  deadline_time?: string;
};

export type TaskListItemResponsible = {
  task_id: number;
  task_name: string;
  responsible_user: string;
  task_description?: string;
};
