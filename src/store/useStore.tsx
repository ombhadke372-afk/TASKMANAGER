import { create } from 'zustand';
import type { Task, Filters, ViewMode, SortField, SortDirection, CollaborationUser } from '../types';
import { generateTasks, USERS } from '../utils/dataGenerator';

interface StoreState {
  tasks: Task[];
  view: ViewMode;
  filters: Filters;
  sortField: SortField | null;
  sortDirection: SortDirection;
  collaborationUsers: CollaborationUser[];

  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setView: (view: ViewMode) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  setSorting: (field: SortField | null, direction: SortDirection) => void;
  initializeFromURL: () => void;
  updateURL: () => void;
  setCollaborationUsers: (users: CollaborationUser[]) => void;
}

const initialFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
};

export const useStore = create<StoreState>((set, get) => ({
  tasks: generateTasks(500),
  view: 'kanban',
  filters: initialFilters,
  sortField: null,
  sortDirection: 'asc',
  collaborationUsers: [],

  setTasks: (tasks) => set({ tasks }),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),

  setView: (view) => {
    set({ view });
    get().updateURL();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().updateURL();
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().updateURL();
  },

  setSorting: (field, direction) => {
    set({ sortField: field, sortDirection: direction });
  },

  initializeFromURL: () => {
    const params = new URLSearchParams(window.location.search);

    const view = params.get('view');
    if (view === 'kanban' || view === 'list' || view === 'timeline') {
      set({ view });
    }

    const filters: Filters = { ...initialFilters };

    const statusParam = params.get('status');
    if (statusParam) {
      filters.status = statusParam.split(',') as any[];
    }

    const priorityParam = params.get('priority');
    if (priorityParam) {
      filters.priority = priorityParam.split(',') as any[];
    }

    const assigneeParam = params.get('assignee');
    if (assigneeParam) {
      filters.assignee = assigneeParam.split(',');
    }

    const dueDateFrom = params.get('dueDateFrom');
    if (dueDateFrom) {
      filters.dueDateFrom = new Date(dueDateFrom);
    }

    const dueDateTo = params.get('dueDateTo');
    if (dueDateTo) {
      filters.dueDateTo = new Date(dueDateTo);
    }

    set({ filters });
  },

  updateURL: () => {
    const { view, filters } = get();
    const params = new URLSearchParams();

    params.set('view', view);

    if (filters.status.length > 0) {
      params.set('status', filters.status.join(','));
    }

    if (filters.priority.length > 0) {
      params.set('priority', filters.priority.join(','));
    }

    if (filters.assignee.length > 0) {
      params.set('assignee', filters.assignee.join(','));
    }

    if (filters.dueDateFrom) {
      params.set('dueDateFrom', filters.dueDateFrom.toISOString().split('T')[0]);
    }

    if (filters.dueDateTo) {
      params.set('dueDateTo', filters.dueDateTo.toISOString().split('T')[0]);
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  },

  setCollaborationUsers: (users) => set({ collaborationUsers: users }),
}));

function getRandomCollaborationUsers(): CollaborationUser[] {
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...USERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(user => ({
    ...user,
    currentTaskId: null,
  }));
}

export function initializeCollaboration(store: StoreState) {
  const users = getRandomCollaborationUsers();
  store.setCollaborationUsers(users);

  const tasks = store.tasks;

  users.forEach(user => {
    const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 50))];
    if (randomTask) {
      user.currentTaskId = randomTask.id;
    }
  });

  setInterval(() => {
    const currentUsers = store.collaborationUsers;
    const updatedUsers = currentUsers.map(user => {
      if (Math.random() < 0.3) {
        const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 50))];
        return { ...user, currentTaskId: randomTask?.id || null };
      }
      return user;
    });
    store.setCollaborationUsers(updatedUsers);
  }, 5000);
}