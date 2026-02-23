"use client";

import { useState } from "react";
import { Message, User } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  user: User;
  isMine: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

export default function MessageBubble({
  message,
  user,
  isMine,
  showAvatar,
  showTimestamp,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [showActions, setShowActions] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(message.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`group flex flex-col ${showAvatar ? "mt-4" : "mt-0.5"} ${
        isMine ? "items-end" : "items-start"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 이름 표시 (상대방 메시지, 아바타 표시 시) */}
      {showAvatar && !isMine && (
        <div className="mb-1 flex items-center gap-2 pl-1">
          <span
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs text-white shadow-sm"
            style={{ backgroundColor: user.color }}
          >
            {user.avatar}
          </span>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {user.name}
          </span>
        </div>
      )}

      {/* 버블 + 타임스탬프 영역 */}
      <div
        className={`relative flex max-w-[75%] items-end gap-1.5 ${
          isMine ? "flex-row-reverse" : "flex-row"
        } ${!isMine && !showAvatar ? "pl-9" : !isMine ? "pl-9" : ""}`}
      >
        {/* 버블 */}
        {isEditing ? (
          <div className="w-full min-w-[200px]">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full resize-none rounded-2xl border-2 border-blue-400 bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-blue-500 dark:bg-zinc-800 dark:text-zinc-200"
              rows={Math.max(1, editText.split("\n").length)}
              autoFocus
            />
            <div className={`mt-1 flex gap-2 text-xs ${isMine ? "justify-end" : ""}`}>
              <button
                onClick={handleSaveEdit}
                className="text-blue-500 hover:text-blue-600"
              >
                저장 (Enter)
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-zinc-400 hover:text-zinc-500"
              >
                취소 (Esc)
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`relative rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
              isMine
                ? "rounded-br-md bg-blue-500 text-white"
                : "rounded-bl-md bg-white text-zinc-800 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">
              {message.text}
              {message.edited && (
                <span
                  className={`ml-1 text-[10px] ${
                    isMine ? "text-blue-200" : "text-zinc-400"
                  }`}
                >
                  (편집됨)
                </span>
              )}
            </p>

            {/* 액션 버튼 */}
            {showActions && !isEditing && (
              <div
                className={`absolute -top-4 z-10 flex gap-0.5 rounded-full border border-zinc-200 bg-white px-1 py-0.5 shadow-md dark:border-zinc-600 dark:bg-zinc-800 ${
                  isMine ? "left-0" : "right-0"
                }`}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full px-1.5 py-0.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                  title="편집"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="rounded-full px-1.5 py-0.5 text-xs text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        )}

        {/* 타임스탬프 */}
        {showTimestamp && !isEditing && (
          <span className="flex-shrink-0 pb-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}
