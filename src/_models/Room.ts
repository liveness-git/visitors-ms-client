export type RoomType = 'rooms' | 'free';
export type Room = {
  id: string;
  name: string;
  email: string;
  type: RoomType;
  sort: string;
};