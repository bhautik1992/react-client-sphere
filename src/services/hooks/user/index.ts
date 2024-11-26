import { userAPI } from 'services/api/users';
import { IUserReq } from 'services/api/users/types';

import { useFetch, useRequest } from '..';
import { userKeys } from '../queryKeys';

export const useUserList = (data: IUserReq) => {
  return useFetch({
    queryFn: () => userAPI.userList(data),
    queryKey: userKeys.userList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useUserDetail = (id: number) => {
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

export const useAddUser = () => {
  return useRequest({
    mutationFn: userAPI.addUser,
    mutationKey: userKeys.userAdd
  });
};

export const useEditUser = () => {
  return useRequest({
    mutationFn: userAPI.editUser,
    mutationKey: userKeys.userEdit
  });
};

export const useDeleteUser = () => {
  return useRequest({
    mutationFn: userAPI.deleteUser,
    mutationKey: userKeys.userDelete
  });
};
