export interface IConsentFormListReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: string | number | bigint;
}

export interface IConsentFormListRes {
  result: IConsentForm[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface IConsentForm {
  _id: string;
  childName: string;
  age: string;
  email: string;
  phoneNumber: string;
  dob: string;
  parentName: string;
  relationToChild: string;
  parentSignature: string;
  parentSignDate: string;
  verifyDate: string;
  verifiedBy: string;
}
