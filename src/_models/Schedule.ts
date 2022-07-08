import { UsageRangeForVisitor } from './Room';

// 一般/フロント 共通
export type Schedule = {
  roomId: string;
  roomName: string;
  roomEmail: string;
  usageRange: UsageRangeForVisitor;
  scheduleItems: ScheduleItem[];
  eventsIndex: number[];
};
export type ScheduleItem = {
  status: string;
  start: number;
  end: number;
};
