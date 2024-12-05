import { vendorAPI } from 'services/api/vendor';
import { IVendorReq } from 'services/api/vendor/types';

import { useFetch, useRequest } from '..';
import { vendorKeys } from '../queryKeys';

export const useVendorList = (data: IVendorReq) => {
  return useFetch({
    queryFn: () => vendorAPI.vendorList(data),
    queryKey: vendorKeys.vendorList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useVendorDetail = (id: number) => {
  return useFetch({
    queryFn: () => vendorAPI.vendorDetail(id),
    queryKey: vendorKeys.vendorDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddVendor = () => {
  return useRequest({
    mutationFn: vendorAPI.addVendor,
    mutationKey: vendorKeys.vendorAdd
  });
};

export const useEditVendor = () => {
  return useRequest({
    mutationFn: vendorAPI.editVendor,
    mutationKey: vendorKeys.vendorEdit
  });
};

export const useDeleteVendor = () => {
  return useRequest({
    mutationFn: vendorAPI.deleteVendor,
    mutationKey: vendorKeys.vendorDelete
  });
};
