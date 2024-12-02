import { countryStateCityAPI } from 'services/api/country';
import { ICityReq, IStateReq } from 'services/api/country/types';

import { useFetch } from '..';
import { countryStateCityKey } from '../queryKeys';

export const useCountryList = () => {
  return useFetch({
    queryFn: () => countryStateCityAPI.countryList(),
    queryKey: countryStateCityKey.countryList,
    queryOptions: {
      staleTime: Infinity,
      retry: false
    }
  });
};

export const useStateList = (data: IStateReq) => {
  return useFetch({
    queryFn: () => countryStateCityAPI.stateList(data),
    queryKey: countryStateCityKey.stateList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: !!data.countryCode
    }
  });
};

export const useCityList = (data: ICityReq) => {
  return useFetch({
    queryFn: () => countryStateCityAPI.cityList(data),
    queryKey: countryStateCityKey.cityList(data),
    queryOptions: {
      staleTime: Infinity,
      retry: false,
      enabled: !!data.stateCode
    }
  });
};
