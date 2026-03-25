import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TaskCard } from '../TaskCard';
import { filterTasks } from '../../utils/taskUtils';
import type { Task, TaskStatus } from '../../types';

const COLUMNS: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export function KanbanView() {
  const { tasks, filters, updateTask, collaborationUsers } = useStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const filteredTasks = filterTasks(tasks, filters);

  const tasksByStatus = COLUMNS.reduce((acc, status) => {
    acc[status] = filteredTasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    if (draggedTask && draggedOverColumn && draggedTask.status !== draggedOverColumn) {
      updateTask(draggedTask.id, { status: draggedOverColumn });
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full p-6">
        <div className="grid grid-cols-4 gap-4 h-full">
          {COLUMNS.map(status => {
            const columnTasks = tasksByStatus[status];
            const isDropTarget = draggedOverColumn === status;

            return (
              <div
                key={status}
                className="flex flex-col min-h-0"
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="font-semibold text-gray-900">{status}</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                <div
                  className={`flex-1 overflow-y-auto px-2 rounded-lg transition-colors ${
                    isDropTarget ? 'bg-blue-50' : ''
                  }`}
                >
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-sm">No tasks</p>
                      <p className="text-xs mt-1">Drag tasks here</p>
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        className="cursor-move"
                      >
                        {draggedTask?.id === task.id ? (
                          <TaskCard
                            task={task}
                            collaborators={collaborationUsers}
                            isPlaceholder
                          />
                        ) : (
                          <TaskCard
                            task={task}
                            collaborators={collaborationUsers}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {draggedTask && dragPosition.x > 0 && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragPosition.x - dragOffset.x,
            top: dragPosition.y - dragOffset.y,
            width: '280px',
          }}
        >
          <div className="opacity-80 shadow-2xl">
            <TaskCard
              task={draggedTask}
              collaborators={collaborationUsers}
              isDragging
            />
          </div>
        </div>
      )}
    </div>
  );
}
