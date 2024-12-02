export interface ICountry {
  name: string;
  isoCode: string;
  currency: string;
}

export interface IState {
  name: string;
  isoCode: string;
  countryCode: string;
}

export interface ICity {
  name: string;
  countryCode: string;
  stateCode: string;
}

export interface IStateReq {
  countryCode: string;
}

export interface ICityReq {
  countryCode: string;
  stateCode: string;
}
