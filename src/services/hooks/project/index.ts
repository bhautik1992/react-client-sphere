import { useMutation } from '@tanstack/react-query';

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

export const useExportProjects = () => {
  return useMutation((filters: IProjectReq) => projectAPI.exportProjects(filters), {
    onError: (error) => {
      console.error('Export failed:', error);
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Projects_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });
};
