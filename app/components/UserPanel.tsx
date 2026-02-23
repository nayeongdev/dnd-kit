"use client";

import { User } from "../types/chat";

interface UserPanelProps {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onAddUser: () => void;
  onRemoveUser: (userId: string) => void;
}

export default function UserPanel({
  users,
  currentUserId,
  onSelectUser,
  onAddUser,
  onRemoveUser,
}: UserPanelProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          참여자
        </h3>
        <button
          onClick={onAddUser}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm text-white transition-colors hover:bg-blue-600"
          title="참여자 추가"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`group relative flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium transition-all ${
              currentUserId === user.id
                ? "bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
              style={{ backgroundColor: user.color }}
            >
              {user.avatar}
            </span>
            <span>{user.name}</span>
            {users.length > 2 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveUser(user.id);
                }}
                className="ml-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[10px] text-white hover:bg-red-500 group-hover:flex"
                title="삭제"
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
