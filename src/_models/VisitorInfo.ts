import { PatternedRecurrence, PatternedRecurrenceInput } from './PatternedRecurrence';
import { UsageRangeForVisitor } from './Room';
import { EmailAddress, UserStatus } from './User';

// 一般/フロント 共通
export type VisitorInfo = {
  iCalUId: string;
  subject: string;
  visitorId: string;
  usageRange: UsageRangeForVisitor;
  visitCompany: string;
  visitorName: string;
  numberOfVisitor: number;
  numberOfEmployee: number;
  mailto: { authors: EmailAddress[]; required: EmailAddress[]; optional: EmailAddress[] };
  resourcies: {
    [room: string]: VisitorInfoResourcies;
  };
  comment: string;
  contactAddr: string;
  seriesMasterId: string | undefined;
};

export type VisitorInfoResourcies = {
  teaSupply: boolean;
  numberOfTeaSupply: number;
  teaDetails: string;
};

// 読み取り専用項目
export type VisitorInfoReadOnly = {
  apptTime: string;
  startDateTime: number;
  endDateTime: number;
  roomName: string; //表での表示用
  roomStatus: string; // TODO:複数会議室未対応 //表での表示用
  reservationName: string;
  reservationStatus: UserStatus;
  isAuthor: boolean;
  isAttendees: boolean;
  isMSMultipleLocations: boolean; // MSEventに複数の場所(会議室以外も含む)が登録されているか否か
  resourcies: {
    [room: string]: ResourciesReadOnly;
  };
  lastUpdated: number;
  recurrence: PatternedRecurrence | undefined;
  eventType: GraphApiEventType;
};
export type GraphApiEventType = 'singleInstance' | 'occurrence' | 'exception' | 'seriesMaster';

export type ResourciesReadOnly = {
  roomName: string; // outlook情報
  roomEmail: string; // outlook情報
  roomStatus: string | undefined;
};

// 編集画面で型が変更になる項目
export type EventInputType = {
  startTime: Date;
  endTime: Date;
  resourcies: {
    [room: string]: ResourciesInputType;
  };
  recurrence: PatternedRecurrenceInput | undefined;
};
export type ResourciesInputType = {
  roomForEdit: string;
};

// 会議室ごとの入力対応
export type RoomInputType = { [room: string]: VisitorInfoResourcies & ResourciesInputType };

// フロント画面のみ
export type VisitorInfoFront = {
  checkIn: string;
  checkOut: string;
  visitorCardNumber: string;
};

// フロントの編集画面用
export type FrontInputType = {
  id: string;
  iCalUId: string;
  seriesMasterId: string | undefined;
};
