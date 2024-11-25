import { trainningAPI } from 'services/api/training';
import { ITrainingReq } from 'services/api/training/types';

import { useFetch, useRequest } from '..';
import { trainingKeys } from '../queryKeys';

export const useTrainingList = (data: ITrainingReq) => {
  return useFetch({
    queryFn: () => trainningAPI.trainingList(data),
    queryKey: trainingKeys.trainingList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useTrainingDetail = (id: string) => {
  return useFetch({
    queryFn: () => trainningAPI.trainingDetail(id),
    queryKey: trainingKeys.trainingDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddTraining = () => {
  return useRequest({
    mutationFn: trainningAPI.addTraining,
    mutationKey: trainingKeys.trainingAdd
  });
};

export const useEditTraining = () => {
  return useRequest({
    mutationFn: trainningAPI.editTraining,
    mutationKey: trainingKeys.trainingEdit
  });
};

export const useDeleteTraining = () => {
  return useRequest({
    mutationFn: trainningAPI.deleteTraining,
    mutationKey: trainingKeys.trainingDelete
  });
};
