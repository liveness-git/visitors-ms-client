export const nameOfRoomType = ['rooms', 'free'] as const;
export type RoomType = (typeof nameOfRoomType)[number];

export const nameOfUsageRangeForVisitor = ['outside', 'inside'] as const;
export type UsageRangeForVisitor = (typeof nameOfUsageRangeForVisitor)[number];
export const nameOfUsageRange = ['none', ...nameOfUsageRangeForVisitor] as const;
export type UsageRange = (typeof nameOfUsageRange)[number];

export type Room = {
  id: string;
  name: string;
  email: string;
  sort: string;
  usageRange: UsageRange;
  type: RoomType;
  teaSupply: { outside: boolean; inside: boolean };
  comment: string;
  cleaningOption: boolean;
  noReservations?: boolean; // add ver.1.4.0
  reservationPeriod?: number; // add ver.1.0.6
  onlyDuringWorkHours?: boolean; // add ver.1.3.0
  displayLivenessRooms?: boolean; // add ver.1.3.0
  location: string;
  category: string;
};
