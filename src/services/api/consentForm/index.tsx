import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IConsentForm, IConsentFormListReq, IConsentFormListRes } from './types';

export const consentFormAPI = {
  async consentFormList(data: IConsentFormListReq): Promise<IConsentFormListRes> {
    return apiInstance
      .post(ApiEndPoints.consentForm.consentFormList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async consentFormDetail(id: string): Promise<IConsentForm> {
    return apiInstance
      .get(`${ApiEndPoints.consentForm.consentFormDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
