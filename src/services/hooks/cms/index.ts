import { cmsAPI } from 'services/api/cms';

import { useFetch, useRequest } from '..';
import { cmsKey } from '../queryKeys';

export const useCmsList = () => {
  return useFetch({
    queryFn: () => cmsAPI.cmsList(),
    queryKey: cmsKey.cmsList,
    queryOptions: {
      staleTime: Infinity
    }
  });
};

export const useCmsDetail = (id: string) => {
  return useFetch({
    queryFn: () => cmsAPI.cmsDetail(id),
    queryKey: cmsKey.cmsDetail(id),
    queryOptions: {
      staleTime: Infinity,
      enabled: Boolean(id)
    }
  });
};

export const useCmsEdit = () => {
  return useRequest({
    mutationFn: cmsAPI.cmsEdit,
    mutationKey: cmsKey.cmsEdit
  });
};
