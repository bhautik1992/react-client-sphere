import { projectAPI } from 'services/api/project';
import { IProjectReq } from 'services/api/project/types';

import { useFetch, useRequest } from '..';
import { projectKeys } from '../queryKeys';

export const useProjectList = (data: IProjectReq) => {
  return useFetch({
    queryFn: () => projectAPI.projectList(data),
    queryKey: projectKeys.projectList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useProjectDetail = (id: number) => {
  return useFetch({
    queryFn: () => projectAPI.projectDetail(id),
    queryKey: projectKeys.projectDetail(id),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: Boolean(id)
    }
  });
};

export const useAddProject = () => {
  return useRequest({
    mutationFn: projectAPI.addProject,
    mutationKey: projectKeys.projectAdd
  });
};

export const useEditProject = () => {
  return useRequest({
    mutationFn: projectAPI.editProject,
    mutationKey: projectKeys.projectEdit
  });
};

export const useProjectStatus = () => {
  return useRequest({
    mutationFn: projectAPI.projectStatus,
    mutationKey: projectKeys.projectStatus
  });
};

export const useDeleteProject = () => {
  return useRequest({
    mutationFn: projectAPI.deleteProject,
    mutationKey: projectKeys.projectDelete
  });
};
