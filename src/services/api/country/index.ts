import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IAddCountryReq, IAddCountryRes, ICountryRes } from './types';

export const countryAPI = {
  async countryList(): Promise<ICountryRes[]> {
    return apiInstance
      .get(`${ApiEndPoints.country.countryList}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addCountry(data: IAddCountryReq): Promise<IAddCountryRes> {
    return apiInstance
      .post(ApiEndPoints.country.addCountry, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
