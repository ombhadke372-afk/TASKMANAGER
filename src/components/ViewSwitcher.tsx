import React from 'react';
import { LayoutGrid, List, CalendarRange } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ViewMode } from '../types';

export function ViewSwitcher() {
  const { view, setView } = useStore();

  const views: Array<{ mode: ViewMode; label: string; icon: React.ReactNode }> = [
    { mode: 'kanban', label: 'Kanban', icon: <LayoutGrid className="w-4 h-4" /> },
    { mode: 'list', label: 'List', icon: <List className="w-4 h-4" /> },
    { mode: 'timeline', label: 'Timeline', icon: <CalendarRange className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      {views.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => setView(mode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === mode
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
