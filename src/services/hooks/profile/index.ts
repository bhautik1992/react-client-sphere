import { profileAPI } from 'services/api/profile';

import { useFetch, useRequest } from '..';
import { profileKey } from '../queryKeys';

export const useProfileDetail = () => {
  return useFetch({
    queryFn: () => profileAPI.profileDetail(),
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
