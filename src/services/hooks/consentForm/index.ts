import { consentFormAPI } from 'services/api/consentForm';
import { IConsentFormListReq } from 'services/api/consentForm/types';

import { useFetch } from '..';
import { consentFormKeys } from '../queryKeys';

export const useConsentFormList = (data: IConsentFormListReq) => {
  return useFetch({
    queryFn: () => consentFormAPI.consentFormList(data),
    queryKey: consentFormKeys.consentFormList(data),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false // default: true
    }
  });
};

export const useConsentFormDetail = (id: string) => {
  return useFetch({
    queryFn: () => consentFormAPI.consentFormDetail(id),
    queryKey: consentFormKeys.consentFormDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};
