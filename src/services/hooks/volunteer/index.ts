import { volunteerAPI } from 'services/api/volunteer';
import { IVolunteerReq } from 'services/api/volunteer/types';

import { useFetch, useRequest } from '..';
import { volunteerKeys } from '../queryKeys';

export const useVolunteerList = (data: IVolunteerReq) => {
  return useFetch({
    queryFn: () => volunteerAPI.volunteerList(data),
    queryKey: volunteerKeys.volunteerList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useVolunteerDetail = (id: string) => {
  return useFetch({
    queryFn: () => volunteerAPI.volunteerDetail(id),
    queryKey: volunteerKeys.volunteerDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddVolunteer = () => {
  return useRequest({
    mutationFn: volunteerAPI.addVolunteer,
    mutationKey: volunteerKeys.volunteerAdd
  });
};

export const useEditVolunteer = () => {
  return useRequest({
    mutationFn: volunteerAPI.editVolunteer,
    mutationKey: volunteerKeys.volunteerEdit
  });
};

export const useVolunteerStatus = () => {
  return useRequest({
    mutationFn: volunteerAPI.volunteerStatus,
    mutationKey: volunteerKeys.volunteerStatus
  });
};
