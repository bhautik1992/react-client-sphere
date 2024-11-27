export interface ICountryRes {
  id: number;
  name: string;
}

export interface IAddCountryReq {
  name: string;
}

export interface IAddCountryRes {}

export interface ICountry {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
