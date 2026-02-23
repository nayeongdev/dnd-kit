"use client";

import { useDroppable } from "@dnd-kit/core";

interface DropZoneProps {
  index: number;
  isActive: boolean;
  sameUser: boolean; // 앞뒤 메시지가 같은 유저인지
}

export default function DropZone({ index, isActive, sameUser }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative ${sameUser ? "py-0.5" : "py-4"}`}
    >
      <div
        className={`mx-4 rounded-full transition-colors ${
          isOver
            ? "h-[1px] bg-blue-500 shadow-sm shadow-blue-500/50"
            : "h-[1px] bg-transparent"
        }`}
      />
    </div>
  );
}
