import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';

export const milestoneAPI = {
  async deleteMilestone(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.milestone.deleteMilestone}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
