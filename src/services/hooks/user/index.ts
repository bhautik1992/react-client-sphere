import { userAPI } from 'services/api/user';
import { IUserListReq } from 'services/api/user/types';

import { useFetch, useRequest } from '..';
import { userKeys } from '../queryKeys';

export const useUserList = (data: IUserListReq) => {
  return useFetch({
    queryFn: () => userAPI.userList(data),
    queryKey: userKeys.userList(data),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false // default: true
    }
  });
};

export const useUserDetail = (id: string) => {
  return useFetch({
    queryFn: () => userAPI.userDetail(id),
    queryKey: userKeys.userDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useUserStatus = () => {
  return useRequest({
    mutationFn: userAPI.userStatus,
    mutationKey: userKeys.userStatus
  });
};
