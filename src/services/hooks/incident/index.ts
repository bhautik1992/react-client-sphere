import { incidentAPI } from 'services/api/incident';
import { IIncidentReq } from 'services/api/incident/type';

import { useFetch, useRequest } from '..';
import { incidentKeys } from '../queryKeys';

export const useIncidentList = (data: IIncidentReq) => {
  return useFetch({
    queryFn: () => incidentAPI.incidentList(data),
    queryKey: incidentKeys.incidentList(data),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false // default: true
    }
  });
};

export const useIncidentListByUserOrVolunteer = (data: IIncidentReq) => {
  return useFetch({
    queryFn: () => incidentAPI.incidentList(data),
    queryKey: incidentKeys.incidentList(data),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false, // default: true
      enabled: Boolean(data?.userId ?? data?.volunteerId)
    }
  });
};

export const useIncidentDelete = () => {
  return useRequest({
    mutationFn: incidentAPI.incidentDelete,
    mutationKey: incidentKeys.incidentDelete
  });
};

export const useIncidentDetail = (id: string) => {
  return useFetch({
    queryFn: () => incidentAPI.incidentDetail(id),
    queryKey: incidentKeys.incidentDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useIncidentCommentList = (id: string) => {
  return useFetch({
    queryFn: () => incidentAPI.incidentCommentList(id),
    queryKey: incidentKeys.incidentCommnetList(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};
