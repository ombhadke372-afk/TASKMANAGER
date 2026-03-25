import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { filterTasks, getPriorityColor } from '../../utils/taskUtils';
import { Avatar } from '../ui/Avatar';

export function TimelineView() {
  const { tasks, filters } = useStore();
  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);

  const daysInMonth = monthEnd.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = now.getDate();

  const getTaskPosition = (task: typeof filteredTasks[0]) => {
    const startDate = task.startDate || task.dueDate;
    const endDate = task.dueDate;

    const start = new Date(startDate);
    const end = new Date(endDate);

    let startDay: number;
    let endDay: number;

    if (start.getMonth() === currentMonth && start.getFullYear() === currentYear) {
      startDay = start.getDate();
    } else if (start < monthStart) {
      startDay = 1;
    } else {
      return null;
    }

    if (end.getMonth() === currentMonth && end.getFullYear() === currentYear) {
      endDay = end.getDate();
    } else if (end > monthEnd) {
      endDay = daysInMonth;
    } else {
      return null;
    }

    if (startDay === endDay) {
      return {
        left: ((startDay - 1) / daysInMonth) * 100,
        width: (1 / daysInMonth) * 100,
        isSingleDay: true,
      };
    }

    const left = ((startDay - 1) / daysInMonth) * 100;
    const width = ((endDay - startDay + 1) / daysInMonth) * 100;

    return { left, width, isSingleDay: false };
  };

  const tasksWithPosition = filteredTasks
    .map(task => ({
      task,
      position: getTaskPosition(task),
    }))
    .filter(item => item.position !== null);

  if (tasksWithPosition.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No tasks in current month</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 min-w-max">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="relative">
          <div className="flex border-b border-gray-200 mb-4 pb-2">
            {days.map(day => (
              <div
                key={day}
                className={`flex-1 text-center text-xs ${
                  day === today ? 'font-bold text-blue-600' : 'text-gray-500'
                }`}
                style={{ minWidth: '40px' }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
              style={{ left: `${((today - 0.5) / daysInMonth) * 100}%` }}
            />
          </div>

          <div className="space-y-2 relative" style={{ minHeight: '400px' }}>
            {tasksWithPosition.map(({ task, position }) => {
              if (!position) return null;

              const color = getPriorityColor(task.priority);

              return (
                <div
                  key={task.id}
                  className="relative h-12 group"
                >
                  <div
                    className="absolute top-1 h-10 rounded-md flex items-center px-2 text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    style={{
                      left: `${position.left}%`,
                      width: `${position.width}%`,
                      backgroundColor: color,
                      minWidth: position.isSingleDay ? '8px' : '40px',
                    }}
                  >
                    {!position.isSingleDay && (
                      <div className="flex items-center gap-2 truncate">
                        <Avatar
                          initials={task.assignee.initials}
                          color={task.assignee.color}
                          size="sm"
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                    )}
                    {position.isSingleDay && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </div>

                  {position.isSingleDay && (
                    <div className="absolute left-0 top-12 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-20 whitespace-nowrap">
                      {task.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
