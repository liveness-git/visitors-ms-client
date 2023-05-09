import { RoomType, UsageRangeForVisitor } from './Room';

// 一般/フロント 共通
export type Schedule = {
  date: number;
  categoryId: string;
  roomId: string;
  roomName: string;
  roomEmail: string;
  type: RoomType;
  usageRange: UsageRangeForVisitor;
  scheduleItems: ScheduleItem[][];
  eventsIndex: number[][];
  lroomsIndex: number[][];
};
export type ScheduleItem = {
  status: string;
  start: number;
  end: number;
};
