import { EmailAddress } from './User';

export type Category = {
  id: string;
  name: string;
  sort: string;
  limitedPublic: boolean;
  members: EmailAddress[];
  disabledByRoom: boolean;
};
