import { Key } from 'react';

export interface IIncidentReq {
  limit: number;
  offset: number;
  search?: string;
  userId?: string;
  type?: FilterValue | React.Key[] | undefined;
  status?: FilterValue | React.Key[] | undefined;
  volunteerId?: string;
  sortOrder?: number | string;
  sortBy?: string | number | bigint;
}

export interface IIncidentRes {
  result: IIncident[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface IIncident {
  _id: string;
  userName: string;
  phoneNumber: string;
  type: string;
  harmed: string;
  title: string;
  place: string;
  status: string;
  volunteer: string;
  incidentDateTime: string;
}

export interface IIncidentDetailRes {
  _id: string;
  type: string;
  title: string;
  harmed: string;
  date: string;
  time: string;
  incidentDateTime: string;
  place: string;
  descriptionText: string;
  descriptionAudioFileUrl: IAudioAndImage;
  evidence: IAudioAndImage[];
  status: string;
  isDeleted: boolean;
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
  userId: IUserDetail;
  volunteerId: IVolunteerDetail;
}

interface IAudioAndImage {
  signedUrl: string;
  type: string;
  url: string;
}

interface IComment {
  userId: string;
  content: string;
  _id: string;
  createdAt: string;
}

interface IUserDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  school: string;
  standard: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  profilePicture: string;
  isVerified: boolean;
  emailVerificationToken?: any;
  createdAt: string;
}

interface IVolunteerDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  birthDate: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  zipCode?: any;
  address: string;
  createdAt: string;
}

export interface IIncidentCommentRes {
  comments: IIncidentComment[];
}

interface IIncidentComment {
  content: string;
  _id: string;
  createdAt: string;
  user: IUser;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
}
