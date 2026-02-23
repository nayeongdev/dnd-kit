"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { User, Message } from "../types/chat";
import UserPanel from "../components/UserPanel";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ChatLogList from "../components/ChatLogList";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const NAMES = [
  "민수",
  "지영",
  "현우",
  "수진",
  "도윤",
  "하은",
  "시우",
  "예린",
];

const AVATARS = ["민", "지", "현", "수", "도", "하", "시", "예"];

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

const initialUsers: User[] = [
  { id: "user-1", name: "민수", avatar: "민", color: COLORS[0] },
  { id: "user-2", name: "지영", avatar: "지", color: COLORS[1] },
];

const initialMessages: Message[] = [
  {
    id: "msg-1",
    userId: "user-1",
    text: "안녕하세요! 채팅 에디터에 오신 것을 환영합니다.",
    timestamp: new Date(Date.now() - 120000),
    edited: false,
  },
  {
    id: "msg-2",
    userId: "user-2",
    text: "반갑습니다! 텍스트 메시지 편집 기능을 테스트해 보세요.",
    timestamp: new Date(Date.now() - 60000),
    edited: false,
  },
  {
    id: "msg-3",
    userId: "user-1",
    text: "메시지에 마우스를 올리면 편집/삭제 버튼이 나타납니다.\nShift+Enter로 줄바꿈도 가능합니다.",
    timestamp: new Date(),
    edited: false,
  },
];

export default function ChatEditorPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentUserId, setCurrentUserId] = useState<string>("user-1");
  const [insertIndex, setInsertIndex] = useState<number>(initialMessages.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0];

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: generateId(),
      userId: currentUserId,
      text,
      timestamp: new Date(),
      edited: false,
    };
    setMessages((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(insertIndex, next.length);
      next.splice(safeIndex, 0, newMessage);
      return next;
    });
    setInsertIndex((prev) => prev + 1);
  };

  const handleEditMessage = (id: string, newText: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, text: newText, edited: true } : msg
      )
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((msg) => msg.id === id);
      const next = prev.filter((msg) => msg.id !== id);
      // 삭제된 메시지가 insertIndex 이전이면 insertIndex를 1 감소
      if (idx !== -1 && idx < insertIndex) {
        setInsertIndex((i) => Math.max(0, i - 1));
      }
      // insertIndex가 새 길이를 초과하지 않도록 보정
      if (insertIndex > next.length) {
        setInsertIndex(next.length);
      }
      return next;
    });
  };

  const handleAddUser = () => {
    const usedIndices = users.map((u) => NAMES.indexOf(u.name));
    const nextIndex = NAMES.findIndex((_, i) => !usedIndices.includes(i));

    if (nextIndex === -1) {
      alert("더 이상 참여자를 추가할 수 없습니다 (최대 8명).");
      return;
    }

    const newUser: User = {
      id: generateId(),
      name: NAMES[nextIndex],
      avatar: AVATARS[nextIndex],
      color: COLORS[nextIndex],
    };

    setUsers((prev) => [...prev, newUser]);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) {
      setCurrentUserId(users.find((u) => u.id !== userId)?.id ?? users[0].id);
    }
  };

  const handleClearAll = () => {
    setMessages([]);
  };

  const handleExport = () => {
    const exportData = messages.map((msg) => {
      const user = users.find((u) => u.id === msg.userId);
      return {
        user: user?.name ?? "알 수 없음",
        text: msg.text,
        time: msg.timestamp.toISOString(),
        edited: msg.edited,
      };
    });
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* 채팅 영역 (뷰포트 높이만큼) */}
      <div className="flex h-screen flex-col">
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-700 dark:bg-zinc-900">
          <div>
            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              💬 채팅 에디터
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              메시지 {messages.length}개 · 참여자 {users.length}명
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              내보내기
            </button>
            <button
              onClick={handleClearAll}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              전체 삭제
            </button>
          </div>
        </header>

        {/* 유저 패널 */}
        <UserPanel
          users={users}
          currentUserId={currentUserId}
          onSelectUser={setCurrentUserId}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />

        {/* 메시지 목록 */}
        <div className="relative flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <div className="absolute inset-0 overflow-y-auto">
            <MessageList
              messages={messages}
              users={users}
              currentUserId={currentUserId}
              insertIndex={insertIndex}
              onInsertIndexChange={setInsertIndex}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 메시지 입력 */}
        <MessageInput
          currentUserName={currentUser.name}
          onSend={handleSendMessage}
        />
      </div>

      {/* 채팅 목록 리스트 (뷰포트 아래) */}
      <div className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/90 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            📋 채팅 목록 ({messages.length})
          </h3>
        </div>
        <ChatLogList
          messages={messages}
          users={users}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>
  );
}
