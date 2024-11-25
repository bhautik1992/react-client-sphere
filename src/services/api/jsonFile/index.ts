import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';

export const jsonAPI = {
  async jsonFile(fileType: string): Promise<Record<string, any>> {
    return apiInstance
      .get(`${ApiEndPoints.json.jsonFile}/${fileType}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
