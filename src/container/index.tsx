import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ThemeConfig from 'style/Config';
import GlobalStyle from 'style/Global';

import { ErrorBoundary } from '../components/common/Error';
import { Loader } from 'components/common/loader';

import { setupAxios } from '../utils/functions';
import Routes from './routes';

setupAxios();

const queryClient = new QueryClient();

const AppContainer = () => (
  <ThemeConfig>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            // <LoaderWrapper>
            //   <h6 style={{ textAlign: 'center' }}>Loading</h6>
            // </LoaderWrapper>
            <Loader />
          }
        >
          <BrowserRouter>
            <GlobalStyle />
            <Routes />
          </BrowserRouter>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  </ThemeConfig>
);

export default AppContainer;
