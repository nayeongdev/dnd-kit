"use client";

interface InsertionDividerProps {
  isDragging?: boolean;
}

export default function InsertionDivider({
  isDragging = false,
}: InsertionDividerProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-1.5 transition-opacity ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      {/* 왼쪽 수평선 */}
      <div className="h-[1px] flex-1 bg-blue-400 dark:bg-blue-500" />

      {/* 칩 */}
      <span className="inline-flex cursor-grab items-center gap-1 whitespace-nowrap rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-500 select-none dark:border-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <span className="text-blue-400 dark:text-blue-500">⠿</span>
        메시지 삽입 위치
      </span>

      {/* 오른쪽 수평선 */}
      <div className="h-[1px] flex-1 bg-blue-400 dark:bg-blue-500" />
    </div>
  );
}

/** DragOverlay 전용 — 파란색 1px 라인 */
export function FloatingDivider() {
  return (
    <div className="flex items-center px-4">
      <div className="h-[2px] w-full rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
    </div>
  );
}
