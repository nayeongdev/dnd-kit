"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { Message, User } from "../types/chat";
import MessageBubble from "./MessageBubble";
import InsertionDivider from "./InsertionDivider";
import DropZone from "./DropZone";

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
  insertIndex: number;
  onInsertIndexChange: (newIndex: number) => void;
  onEditMessage: (id: string, newText: string) => void;
  onDeleteMessage: (id: string) => void;
}

/** Draggable wrapper for InsertionDivider */
function DraggableInsertionDivider({ isDragging }: { isDragging: boolean }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "insertion-divider",
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <InsertionDivider isDragging={isDragging} />
    </div>
  );
}

export default function MessageList({
  messages,
  users,
  currentUserId,
  insertIndex,
  onInsertIndexChange,
  onEditMessage,
  onDeleteMessage,
}: MessageListProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getUserById = (userId: string) =>
    users.find((u) => u.id === userId) ?? users[0];

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { over } = event;
    if (over) {
      const dropId = over.id as string;
      const newIndex = parseInt(dropId.replace("drop-", ""), 10);
      if (!isNaN(newIndex)) {
        onInsertIndexChange(newIndex);
      }
    }
  };

  if (messages.length === 0) {
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-zinc-400 dark:text-zinc-500">
            메시지를 입력해 대화를 시작하세요.
          </p>
          <div className="w-full">
            <DraggableInsertionDivider isDragging={isDragging} />
          </div>
        </div>
      </DndContext>
    );
  }

  // Build interleaved list: [slot0, msg0, slot1, msg1, ..., slotN]
  const elements: React.ReactNode[] = [];

  for (let i = 0; i <= messages.length; i++) {
    // Render slot
    if (i === insertIndex) {
      elements.push(
        <DraggableInsertionDivider key={`divider-${i}`} isDragging={isDragging} />
      );
    } else {
      // 슬롯 i 앞 메시지: messages[i-1], 뒤 메시지: messages[i]
      const prevMsg = i > 0 ? messages[i - 1] : null;
      const nextMsg = i < messages.length ? messages[i] : null;
      const sameUser = !!(prevMsg && nextMsg && prevMsg.userId === nextMsg.userId);

      elements.push(
        <DropZone key={`drop-${i}`} index={i} isActive={isDragging} sameUser={sameUser} />
      );
    }

    // Render message (if not past the end)
    if (i < messages.length) {
      const msg = messages[i];
      const user = getUserById(msg.userId);
      const prevMsg = i > 0 ? messages[i - 1] : null;
      const showAvatar = !prevMsg || prevMsg.userId !== msg.userId;
      const showTimestamp =
        !prevMsg ||
        prevMsg.userId !== msg.userId ||
        msg.timestamp.getTime() - prevMsg.timestamp.getTime() > 60000;

      elements.push(
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
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3">
        {elements}
      </div>
    </DndContext>
  );
}
