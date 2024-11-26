import { clientAPI } from 'services/api/client';
import { IClientReq } from 'services/api/client/types';

import { useFetch, useRequest } from '..';
import { clientKeys } from '../queryKeys';

export const useClientList = (data: IClientReq) => {
  return useFetch({
    queryFn: () => clientAPI.clientList(data),
    queryKey: clientKeys.clientList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useClientDetail = (id: number) => {
  return useFetch({
    queryFn: () => clientAPI.clientDetail(id),
    queryKey: clientKeys.clientDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddClient = () => {
  return useRequest({
    mutationFn: clientAPI.addClient,
    mutationKey: clientKeys.clientAdd
  });
};

export const useEditClient = () => {
  return useRequest({
    mutationFn: clientAPI.editClient,
    mutationKey: clientKeys.clientEdit
  });
};

export const useClientStatus = () => {
  return useRequest({
    mutationFn: clientAPI.clientStatus,
    mutationKey: clientKeys.clientStatus
  });
};
