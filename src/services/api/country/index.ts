import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { ICity, ICityReq, ICountry, IState, IStateReq } from './types';

export const countryStateCityAPI = {
  async countryList(): Promise<ICountry[]> {
    return apiInstance
      .get(`${ApiEndPoints.country_state_city.countryList}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async stateList(data: IStateReq): Promise<IState[]> {
    return apiInstance
      .post(`${ApiEndPoints.country_state_city.stateList}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async cityList(data: ICityReq): Promise<ICity[]> {
    return apiInstance
      .post(`${ApiEndPoints.country_state_city.cityList}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
