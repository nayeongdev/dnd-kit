"use client";

import { Message, User } from "../types/chat";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
  onEditMessage: (id: string, newText: string) => void;
  onDeleteMessage: (id: string) => void;
}

export default function MessageList({
  messages,
  users,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
}: MessageListProps) {
  const getUserById = (userId: string) =>
    users.find((u) => u.id === userId) ?? users[0];

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-400 dark:text-zinc-500">
          메시지를 입력해 대화를 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
      {messages.map((msg, idx) => {
        const user = getUserById(msg.userId);
        const prevMsg = idx > 0 ? messages[idx - 1] : null;
        const showAvatar = !prevMsg || prevMsg.userId !== msg.userId;
        const showTimestamp =
          !prevMsg ||
          prevMsg.userId !== msg.userId ||
          msg.timestamp.getTime() - prevMsg.timestamp.getTime() > 60000;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            user={user}
            isMine={msg.userId === currentUserId}
            showAvatar={showAvatar}
            showTimestamp={showTimestamp}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
          />
        );
      })}
    </div>
  );
}
