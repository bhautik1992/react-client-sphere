import { useMutation } from '@tanstack/react-query';

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

export const useEmployeeStatus = () => {
  return useRequest({
    mutationFn: employeeAPI.employeeStatus,
    mutationKey: employeeKeys.employeeStatus
  });
};

export const useExportEmployees = () => {
  return useMutation((filters: IEmployeeReq) => employeeAPI.exportEmployees(filters), {
    onError: (error) => {
      console.error('Export failed:', error);
    },
    onSuccess: (data) => {
      const blob = data as unknown as Blob;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Employees_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });
};
