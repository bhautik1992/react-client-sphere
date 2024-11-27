import { dashboardAPI } from 'services/api/dashboard';

import { useFetch } from '..';
import { dashboardKey } from '../queryKeys';

export const useDashboard = () => {
  return useFetch({
    queryFn: () => dashboardAPI.dashboardCount(),
    queryKey: dashboardKey.dashboardCount,
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false // default: true
    }
  });
};

export const useDashboardClient = () => {
  return useFetch({
    queryFn: () => dashboardAPI.dashboardClient(),
    queryKey: dashboardKey.dashboardClient,
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useDashboardCompany = () => {
  return useFetch({
    queryFn: () => dashboardAPI.dashboardCompany(),
    queryKey: dashboardKey.dashboardCompany,
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};
