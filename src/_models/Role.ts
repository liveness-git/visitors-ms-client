export type RoleType = 'admin' | 'front';
export type Role = {
  id: string;
  name: RoleType;
  members: string[];
};
