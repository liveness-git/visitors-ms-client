export type User = {
  email: string;
  name: string;
  isAdmin: boolean;
  isFront: boolean;
  contactAddr: string | undefined; // 予約入力画面の連絡先デフォルト値（任意）
};

export const nameOfUserStatus = ['none', 'tentativelyAccepted', 'accepted', 'declined'] as const;
export type UserStatus = typeof nameOfUserStatus[number];

export type EmailAddress = {
  name: string;
  address: string;
  status?: UserStatus;
};
