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
