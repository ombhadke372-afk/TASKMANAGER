import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MultiSelect } from './ui/MultiSelect';
import { Button } from './ui/Button';
import { USERS } from '../utils/dataGenerator';
import type { TaskStatus, TaskPriority } from '../types';

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Done', label: 'Done' },
];

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const ASSIGNEE_OPTIONS = USERS.map(user => ({
  value: user.id,
  label: user.name,
}));

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useStore();

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    filters.dueDateFrom ||
    filters.dueDateTo;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-wrap">
          <MultiSelect
            label="Status"
            options={STATUS_OPTIONS}
            selected={filters.status}
            onChange={(status) => setFilters({ status: status as TaskStatus[] })}
            className="w-48"
          />

          <MultiSelect
            label="Priority"
            options={PRIORITY_OPTIONS}
            selected={filters.priority}
            onChange={(priority) => setFilters({ priority: priority as TaskPriority[] })}
            className="w-48"
          />

          <MultiSelect
            label="Assignee"
            options={ASSIGNEE_OPTIONS}
            selected={filters.assignee}
            onChange={(assignee) => setFilters({ assignee })}
            className="w-48"
          />

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dueDateFrom ? filters.dueDateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFilters({ dueDateFrom: e.target.value ? new Date(e.target.value) : undefined })
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.dueDateTo ? filters.dueDateTo.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFilters({ dueDateTo: e.target.value ? new Date(e.target.value) : undefined })
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To"
            />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
