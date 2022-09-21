export type User = {
  email: string;
  name: string;
  isAdmin: boolean;
  isFront: boolean;
};

export const nameOfUserStatus = ['none', 'tentativelyAccepted', 'accepted', 'declined'] as const;
export type UserStatus = typeof nameOfUserStatus[number];

export type EmailAddress = {
  name: string;
  address: string;
  status?: UserStatus;
};
