export interface User {
  id: string;
  name: string;
  avatar: string; // 이니셜 또는 이모지
  color: string; // 아바타 배경색
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  edited: boolean;
}
