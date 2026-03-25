import React from 'react';
import { Calendar } from 'lucide-react';
import type { Task, CollaborationUser } from '../types';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { formatDueDate } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  collaborators: CollaborationUser[];
  isDragging?: boolean;
  isPlaceholder?: boolean;
}

export function TaskCard({ task, collaborators, isDragging = false, isPlaceholder = false }: TaskCardProps) {
  const { text: dueDateText, isOverdue, isDueToday } = formatDueDate(task.dueDate);

  const activeCollaborators = collaborators.filter(c => c.currentTaskId === task.id);

  if (isPlaceholder) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
          {task.title}
        </h3>
        <Badge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <Avatar
            initials={task.assignee.initials}
            color={task.assignee.color}
            size="sm"
          />
          {activeCollaborators.length > 0 && (
            <div className="flex -space-x-2 ml-1">
              {activeCollaborators.slice(0, 2).map(collab => (
                <div
                  key={collab.id}
                  className="ring-2 ring-white rounded-full"
                >
                  <Avatar
                    initials={collab.initials}
                    color={collab.color}
                    size="sm"
                  />
                </div>
              ))}
              {activeCollaborators.length > 2 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center ring-2 ring-white font-semibold">
                  +{activeCollaborators.length - 2}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className={`${isOverdue ? 'text-red-600 font-semibold' : isDueToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            {dueDateText}
          </span>
        </div>
      </div>
    </div>
  );
}
