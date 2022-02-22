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
  apptTime: string;
  roomName: string;
  roomEmail: string;
  reservationName: string;
  isAuthor: boolean;
};
