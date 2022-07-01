import { EmailAddress } from './User';

export const nameOfRoleType = ['admin', 'front'] as const;
export type RoleType = typeof nameOfRoleType[number];
export type Role = {
  id: string;
  name: RoleType;
  members: EmailAddress[];
};
