export const nameOfRoomType = ['rooms', 'free'] as const;
export type RoomType = typeof nameOfRoomType[number];

export const nameOfUsageRange = ['none', 'inside', 'outside'] as const;
export type UsageRange = typeof nameOfUsageRange[number];

export type Room = {
  id: string;
  name: string;
  email: string;
  sort: string;
  usageRange: UsageRange;
  type: RoomType;
  teaSupply: boolean;
  location: string;
  category: string;
};
