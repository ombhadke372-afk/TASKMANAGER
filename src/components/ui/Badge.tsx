import React from 'react';
import type { TaskPriority } from '../../types';

interface BadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function Badge({ priority, className = '' }: BadgeProps) {
  const styles = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[priority]} ${className}`}
    >
      {priority}
    </span>
  );
}
