import type { Task, User, TaskStatus, TaskPriority } from '../types';

const USERS: User[] = [
  { id: '1', name: 'Alice Johnson', initials: 'AJ', color: '#3b82f6' },
  { id: '2', name: 'Bob Smith', initials: 'BS', color: '#10b981' },
  { id: '3', name: 'Carol White', initials: 'CW', color: '#f59e0b' },
  { id: '4', name: 'David Brown', initials: 'DB', color: '#ef4444' },
  { id: '5', name: 'Emma Davis', initials: 'ED', color: '#8b5cf6' },
  { id: '6', name: 'Frank Wilson', initials: 'FW', color: '#ec4899' },
];

const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES: TaskPriority[] = ['Critical', 'High', 'Medium', 'Low'];

const TASK_PREFIXES = [
  'Implement',
  'Fix',
  'Update',
  'Refactor',
  'Design',
  'Review',
  'Test',
  'Deploy',
  'Optimize',
  'Debug',
];

const TASK_SUBJECTS = [
  'authentication system',
  'user dashboard',
  'API endpoints',
  'database schema',
  'payment integration',
  'email notifications',
  'search functionality',
  'mobile responsiveness',
  'error handling',
  'performance metrics',
  'user permissions',
  'data validation',
  'caching layer',
  'analytics tracking',
  'file uploads',
  'dark mode',
  'accessibility features',
  'documentation',
  'unit tests',
  'CI/CD pipeline',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const createdAt = randomDate(thirtyDaysAgo, now);
    const dueDate = randomDate(now, thirtyDaysFromNow);

    const hasStartDate = Math.random() > 0.1;
    const startDate = hasStartDate
      ? randomDate(createdAt, dueDate)
      : undefined;

    const isOverdue = Math.random() < 0.15;
    const finalDueDate = isOverdue
      ? randomDate(thirtyDaysAgo, now)
      : dueDate;

    tasks.push({
      id: `task-${i + 1}`,
      title: `${randomItem(TASK_PREFIXES)} ${randomItem(TASK_SUBJECTS)}`,
      status: randomItem(STATUSES),
      priority: randomItem(PRIORITIES),
      assignee: randomItem(USERS),
      dueDate: finalDueDate,
      startDate,
      createdAt,
    });
  }

  return tasks;
}

export { USERS };
