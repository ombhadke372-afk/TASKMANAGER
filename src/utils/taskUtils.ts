import type { Task, Filters, SortField, SortDirection, TaskPriority } from '../types';

export function filterTasks(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee.id)) {
      return false;
    }

    if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) {
      return false;
    }

    if (filters.dueDateTo && task.dueDate > filters.dueDateTo) {
      return false;
    }

    return true;
  });
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function sortTasks(
  tasks: Task[],
  field: SortField | null,
  direction: SortDirection
): Task[] {
  if (!field) return tasks;

  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'dueDate':
        comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

export function formatDueDate(dueDate: Date): { text: string; isOverdue: boolean; isDueToday: boolean } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due Today', isOverdue: false, isDueToday: true };
  }

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    if (daysOverdue > 7) {
      return { text: `${daysOverdue} days overdue`, isOverdue: true, isDueToday: false };
    }
    return { text: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue: true, isDueToday: false };
  }

  return { text: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue: false, isDueToday: false };
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  };
  return colors[priority];
}
