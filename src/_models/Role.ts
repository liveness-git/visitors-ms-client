import { EmailAddress } from './User';

export const nameOfRole = ['admin', 'front'] as const;
export type RoleType = typeof nameOfRole[number];
export type Role = {
  id: string;
  name: RoleType;
  members: EmailAddress[];
};
