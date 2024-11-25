import { profileAPI } from 'services/api/profile';

import { useFetch, useRequest } from '..';
import { profileKey } from '../queryKeys';

export const useProfileDetail = (id: number) => {
  return useFetch({
    queryFn: () => profileAPI.profileDetail(id),
    queryKey: profileKey.profileDetail,
    queryOptions: {
      staleTime: Infinity
    }
  });
};

export const useProfileEdit = () => {
  return useRequest({
    mutationFn: profileAPI.profileEdit,
    mutationKey: profileKey.profileEdit
  });
};
