export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: User;
  dueDate: Date;
  startDate?: Date;
  createdAt: Date;
}

export interface Filters {
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface CollaborationUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  currentTaskId: string | null;
}