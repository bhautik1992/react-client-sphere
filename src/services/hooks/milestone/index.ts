import { milestoneAPI } from 'services/api/mileStone';

import { useRequest } from '..';
import { milestoneKeys } from '../queryKeys';

export const useDeleteMilestone = () => {
  return useRequest({
    mutationFn: milestoneAPI.deleteMilestone,
    mutationKey: milestoneKeys.milestoneDelete
  });
};
