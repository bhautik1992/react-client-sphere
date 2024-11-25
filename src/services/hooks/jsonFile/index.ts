import { jsonAPI } from 'services/api/jsonFile';

import { useFetch } from '..';
import { jsonFileKey } from '../queryKeys';

export const useJsonFile = (fileType: string) => {
  return useFetch({
    queryFn: () => jsonAPI.jsonFile(fileType),
    queryKey: jsonFileKey.jsonFileType(fileType),
    queryOptions: {
      staleTime: Infinity,
      refetchInterval: 10 * 60 * 1000, // 10 minutes
      refetchIntervalInBackground: true,
      retry: false,
      refetchOnWindowFocus: false, // default: true,
      enabled: Boolean(fileType)
    }
  });
};
