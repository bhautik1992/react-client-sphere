import { countryAPI } from 'services/api/country';

import { useFetch, useRequest } from '..';
import { countryKey } from '../queryKeys';

export const useCountryList = () => {
  return useFetch({
    queryFn: () => countryAPI.countryList(),
    queryKey: countryKey.countryList,
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useAddCountry = () => {
  return useRequest({
    mutationFn: countryAPI.addCountry,
    mutationKey: countryKey.countryAdd
  });
};
