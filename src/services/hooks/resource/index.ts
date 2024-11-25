import { resourceAPI } from 'services/api/resources';
import { IResourceReq } from 'services/api/resources/types';

import { useFetch, useRequest } from '..';
import { resourceKeys } from '../queryKeys';

export const useResourceList = (data: IResourceReq) => {
  return useFetch({
    queryFn: () => resourceAPI.resourceList(data),
    queryKey: resourceKeys.resourceList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useResourceDetail = (id: string) => {
  return useFetch({
    queryFn: () => resourceAPI.resourceDetail(id),
    queryKey: resourceKeys.resourceDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddEditResource = () => {
  return useRequest({
    mutationFn: resourceAPI.addEditResource,
    mutationKey: resourceKeys.resourceAddEdit
  });
};

export const useDeleteResource = () => {
  return useRequest({
    mutationFn: resourceAPI.deleteResource,
    mutationKey: resourceKeys.resourceDelete
  });
};

export const useResourceTYpeList = () => {
  return useFetch({
    queryFn: () => resourceAPI.resourceTypeList(),
    queryKey: resourceKeys.resourceTypeList,
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useUploadProfile = () => {
  return useRequest({
    mutationFn: resourceAPI.uploadImage,
    mutationKey: resourceKeys.resourceImage
  });
};
