export type VisitorInfoPersonal = {
  iCalUId: string;
  visitorId: string;
  visitCompany: string;
  visitorName: string;
  teaSupply: boolean;
  numberOfVisitor: number;
  numberOfEmployee: number;
  comment: string;
  contactAddr: string;
};

export type VisitorInfoFront = {
  id: string;
  checkIn: string;
  checkOut: string;
  visitorCardNumber: string;
};

export type VisitorInfoMs = {
  subject: string;
  apptTime: string;
  startDateTime: number;
  endDateTime: number;
  roomName: string;
  roomEmail: string;
  reservationName: string;
  isAuthor: boolean;
  resourceStatus: string;
};

export type MsEventInputType = {
  subject: string;
  startTime: Date;
  endTime: Date;
  room: string;
};
