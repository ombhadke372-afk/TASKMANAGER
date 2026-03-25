import React from 'react';
import { Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Avatar } from './ui/Avatar';

export function CollaborationBar() {
  const { collaborationUsers } = useStore();

  const activeUsers = collaborationUsers.filter(user => user.currentTaskId !== null);

  if (activeUsers.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {activeUsers.length} {activeUsers.length === 1 ? 'person is' : 'people are'} viewing this board
        </span>
        <div className="flex -space-x-2">
          {activeUsers.map(user => (
            <div key={user.id} className="ring-2 ring-white rounded-full">
              <Avatar
                initials={user.initials}
                color={user.color}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
