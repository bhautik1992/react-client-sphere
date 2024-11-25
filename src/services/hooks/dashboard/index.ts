import { dashboardAPI } from 'services/api/dashboard';
import { IDashboardReq } from 'services/api/dashboard/types';

import { useFetch } from '..';
import { dashboardKey } from '../queryKeys';

export const useDashboard = (data: IDashboardReq) => {
  return useFetch({
    queryFn: () => dashboardAPI.dashboardCount(data),
    queryKey: dashboardKey.dashboardCount(data),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false // default: true
    }
  });
};
