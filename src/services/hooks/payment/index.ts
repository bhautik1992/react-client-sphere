import { paymentAPI } from 'services/api/payment';
import { IPaymentReq } from 'services/api/payment/types';

import { useFetch, useRequest } from '..';
import { paymentKeys } from '../queryKeys';

export const usePaymentList = (data: IPaymentReq) => {
  return useFetch({
    queryFn: () => paymentAPI.paymentList(data),
    queryKey: paymentKeys.paymentList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const usePaymentDetail = (id: number) => {
  return useFetch({
    queryFn: () => paymentAPI.paymentDetail(id),
    queryKey: paymentKeys.paymentDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddPayment = () => {
  return useRequest({
    mutationFn: paymentAPI.addPayment,
    mutationKey: paymentKeys.paymentAdd
  });
};

export const useDeletePayment = () => {
  return useRequest({
    mutationFn: paymentAPI.deletePayment,
    mutationKey: paymentKeys.paymentDelete
  });
};

export const useGeneratePaymentNumber = () => {
  return useFetch({
    queryFn: () => paymentAPI.generatedPaymentNumber(),
    queryKey: paymentKeys.generatedPaymentNumber
  });
};
