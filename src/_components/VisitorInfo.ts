export type VisitorInfoPersonal = {
  key: string;
  visitCompany: string;
  visitorName: string;
  teaSupply: boolean;
  numberOfVisitor: number;
  numberOfEmployee: number;
  comment: string;
  reservationName: string;
  contactAddr: string;
};

export type VisitorInfoFront = {
  key: string;
  checkIn: string;
  checkOut: string;
  visitorCardNumber: string;
};

export type VisitorInfoMs = {
  apptTime: string;
  roomName: string;
};
