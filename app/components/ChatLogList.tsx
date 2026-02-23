"use client";

import { Message, User } from "../types/chat";

interface ChatLogListProps {
  messages: Message[];
  users: User[];
  onEditMessage: (id: string, newText: string) => void;
  onDeleteMessage: (id: string) => void;
}

export default function ChatLogList({
  messages,
  users,
  onEditMessage,
  onDeleteMessage,
}: ChatLogListProps) {
  const getUserById = (userId: string) =>
    users.find((u) => u.id === userId);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-zinc-400 dark:text-zinc-500">
        등록된 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
      {messages.map((msg, idx) => {
        const user = getUserById(msg.userId);
        return (
          <div
            key={msg.id}
            className="group flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            {/* 번호 */}
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-zinc-200 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {idx + 1}
            </span>

            {/* 아바타 */}
            <span
              className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] text-white"
              style={{ backgroundColor: user?.color ?? "#999" }}
            >
              {user?.avatar ?? "?"}
            </span>

            {/* 이름 */}
            <span className="mt-0.5 w-12 flex-shrink-0 truncate text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {user?.name ?? "알 수 없음"}
            </span>

            {/* 메시지 텍스트 */}
            <p className="min-w-0 flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300">
              {msg.text.replace(/\n/g, " ")}
              {msg.edited && (
                <span className="ml-1 text-[10px] text-zinc-400">(편집됨)</span>
              )}
            </p>

            {/* 시간 */}
            <span className="mt-0.5 flex-shrink-0 text-[10px] text-zinc-400 dark:text-zinc-500">
              {formatTime(msg.timestamp)}
            </span>

            {/* 액션 버튼 */}
            <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => {
                  const newText = prompt("메시지 수정:", msg.text);
                  if (newText !== null && newText.trim()) {
                    onEditMessage(msg.id, newText.trim());
                  }
                }}
                className="rounded px-1.5 py-0.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                title="편집"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteMessage(msg.id)}
                className="rounded px-1.5 py-0.5 text-xs text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                title="삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
