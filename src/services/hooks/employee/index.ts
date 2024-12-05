import { employeeAPI } from 'services/api/employee';
import { IEmployeeReq } from 'services/api/employee/types';

import { useFetch, useRequest } from '..';
import { employeeKeys } from '../queryKeys';

export const useEmployeeList = (data: IEmployeeReq) => {
  return useFetch({
    queryFn: () => employeeAPI.employeeList(data),
    queryKey: employeeKeys.employeeList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useEmployeeDetail = (id: number) => {
  return useFetch({
    queryFn: () => employeeAPI.employeeDetail(id),
    queryKey: employeeKeys.employeeDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddEmployee = () => {
  return useRequest({
    mutationFn: employeeAPI.addEmployee,
    mutationKey: employeeKeys.employeeAdd
  });
};

export const useEditEmployee = () => {
  return useRequest({
    mutationFn: employeeAPI.editEmployee,
    mutationKey: employeeKeys.employeeEdit
  });
};

export const useDeleteEmployee = () => {
  return useRequest({
    mutationFn: employeeAPI.deleteEmployee,
    mutationKey: employeeKeys.employeeDelete
  });
};
