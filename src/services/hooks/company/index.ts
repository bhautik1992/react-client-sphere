import { companyAPI } from 'services/api/company';
import { ICompanyReq } from 'services/api/company/types';

import { useFetch, useRequest } from '..';
import { companyKeys } from '../queryKeys';

export const useCompanyList = (data: ICompanyReq) => {
  return useFetch({
    queryFn: () => companyAPI.companyList(data),
    queryKey: companyKeys.companyList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useCompanyDetail = (id: number) => {
  return useFetch({
    queryFn: () => companyAPI.companyDetail(id),
    queryKey: companyKeys.companyDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddCompany = () => {
  return useRequest({
    mutationFn: companyAPI.addCompany,
    mutationKey: companyKeys.companyAdd
  });
};

export const useEditCompany = () => {
  return useRequest({
    mutationFn: companyAPI.editCompany,
    mutationKey: companyKeys.companyEdit
  });
};

export const useDeleteCompany = () => {
  return useRequest({
    mutationFn: companyAPI.deleteCompany,
    mutationKey: companyKeys.companyDelete
  });
};
