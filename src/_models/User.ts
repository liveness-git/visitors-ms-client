export type User = {
  email: string;
  name: string;
  isAdmin: boolean;
  isFront: boolean;
};
export type EmailAddress = {
  name: string;
  address: string;
  status?: UserStatus;
};
export type UserStatus = 'none' | 'accepted' | 'declined';
