import { invoiceAPI } from 'services/api/invoice';
import { IInvoiceReq } from 'services/api/invoice/types';

import { useFetch, useRequest } from '..';
import { invoiceKeys } from '../queryKeys';

export const useInvoiceList = (data: IInvoiceReq) => {
  return useFetch({
    queryFn: () => invoiceAPI.invoiceList(data),
    queryKey: invoiceKeys.invoiceList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useInvoiceDetail = (id: number) => {
  return useFetch({
    queryFn: () => invoiceAPI.invoiceDetail(id),
    queryKey: invoiceKeys.invoiceDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddInvoice = () => {
  return useRequest({
    mutationFn: invoiceAPI.addInvoice,
    mutationKey: invoiceKeys.invoiceAdd
  });
};

export const useDeleteInvoice = () => {
  return useRequest({
    mutationFn: invoiceAPI.deleteInvoice,
    mutationKey: invoiceKeys.invoiceDelete
  });
};

export const useInvoiceByProjectId = (id: number) => {
  return useFetch({
    queryFn: () => invoiceAPI.getInvoiceByProjectId(id),
    queryKey: invoiceKeys.invoiceByProjectId(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useGenerateInvoiceNumber = () => {
  return useFetch({
    queryFn: () => invoiceAPI.generatedInvoiceNumber(),
    queryKey: invoiceKeys.generatedInvoiceNumber
  });
};

export const useMarkAsPaidInvoice = () => {
  return useRequest({
    mutationFn: invoiceAPI.markAsPaid,
    mutationKey: invoiceKeys.markAsPaid
  });
};
