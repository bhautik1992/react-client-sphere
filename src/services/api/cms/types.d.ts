export interface ICMS {
  _id: string;
  content: string;
  key: string;
  updatedAt: string;
  name: string;
}

export interface ICMSEditReq {
  key: string;
  content: string;
}
