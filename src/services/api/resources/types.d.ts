import { Key } from 'react';

export interface IResource {
  _id: string;
  resourceType: string;
  title: string;
  url: string;
}

export interface IResourceReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
}

export interface IResourceRes {
  result: IResource[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface IResourceDetailRes {
  _id: string;
  title: string;
  url: string;
  resourceType: {
    image: string;
    imageSignUrl: string;
    title: string;
    _id: string;
  };
}

export interface IResourceType {
  _id: string;
  image: string;
  imageSignUrl: string;
  title: string;
}

export interface IResourceTypeRes {
  result: IResourceType[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface IAddEditReq {
  resourceId?: string;
  newResourceType?: string;
  resourceTypeId?: string;
  title: string;
  image?: string;
  url: string;
}

interface IAddEditFormValues {
  types: IOldResourceTypes | INewResourceType[];
  title: string;
  url: string;
}

interface IOldResourceTypes {
  resourceTypeId: string;
}

interface INewResourceType {
  newResourceType: string;
}
