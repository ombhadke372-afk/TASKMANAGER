import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { filterTasks, sortTasks, formatDueDate } from '../../utils/taskUtils';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { useVirtualScroll, useScrollHandler } from '../../hooks/useVirtualScroll';
import type { SortField, SortDirection, TaskStatus } from '../../types';

const ROW_HEIGHT = 60;
const CONTAINER_HEIGHT = window.innerHeight - 250;

const STATUS_OPTIONS = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Done', label: 'Done' },
];

export function ListView() {
  const { tasks, filters, updateTask } = useStore();
  const [scrollTop, setScrollTop] = useState(0);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const sortedTasks = useMemo(
    () => sortTasks(filteredTasks, sortField, sortDirection),
    [filteredTasks, sortField, sortDirection]
  );

  const { virtualItems, totalHeight } = useVirtualScroll({
    itemCount: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  const handleScroll = useScrollHandler(setScrollTop);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1 font-semibold text-sm hover:text-blue-600 transition-colors ${
          isActive ? 'text-blue-600' : 'text-gray-700'
        }`}
      >
        {children}
        <ArrowUpDown className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
      </button>
    );
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No tasks found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">
                  <SortButton field="title">Title</SortButton>
                </th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="priority">Priority</SortButton>
                </th>
                <th className="px-6 py-3 text-left">Assignee</th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="dueDate">Due Date</SortButton>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `${CONTAINER_HEIGHT}px` }}
          onScroll={handleScroll}
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {virtualItems.map(({ index, offsetTop }) => {
              const task = sortedTasks[index];
              const { text: dueDateText, isOverdue, isDueToday } = formatDueDate(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="absolute w-full border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    top: `${offsetTop}px`,
                  }}
                >
                  <table className="w-full h-full">
                    <tbody>
                      <tr>
                        <td className="px-6 py-3 text-sm text-gray-900" style={{ width: '35%' }}>
                          {task.title}
                        </td>
                        <td className="px-6 py-3" style={{ width: '18%' }}>
                          <Dropdown
                            value={task.status}
                            options={STATUS_OPTIONS}
                            onChange={(value) => updateTask(task.id, { status: value as TaskStatus })}
                          />
                        </td>
                        <td className="px-6 py-3" style={{ width: '15%' }}>
                          <Badge priority={task.priority} />
                        </td>
                        <td className="px-6 py-3" style={{ width: '17%' }}>
                          <div className="flex items-center gap-2">
                            <Avatar
                              initials={task.assignee.initials}
                              color={task.assignee.color}
                              size="sm"
                            />
                            <span className="text-sm text-gray-700">{task.assignee.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm" style={{ width: '15%' }}>
                          <span className={`${isOverdue ? 'text-red-600 font-semibold' : isDueToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            {dueDateText}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
