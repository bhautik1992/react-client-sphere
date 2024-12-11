import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import AuthGuard from '../components/common/AuthGuard';

import { ROUTES } from 'utils/constants/routes';

import routesConfig from './routesConfig';

const Layout = lazy(() => import('../components/layout'));
const SignIn = lazy(() => import('../pages/Auth/SignIn'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: React.ComponentType<any> }>;
  roles?: string[];
  children?: RouteConfig[];
}

const generateRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    const Component = lazy(route.component); // Lazy load the component
    const element = route.roles ? (
      <AuthGuard roles={route.roles}>
        <Component />
      </AuthGuard>
    ) : (
      <Component />
    );

    return route.children ? (
      <Route key={route.path} path={route.path} element={<Outlet />}>
        <Route index element={element} />
        {generateRoutes(route.children)} {/* Recursively handle child routes */}
      </Route>
    ) : (
      <Route key={route.path} path={route.path} element={element} />
    );
  });
};

const Routing = () => {
  return (
    <Routes>
      <Route path={ROUTES.signIn} element={<SignIn />} />
      <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
      <Route
        path={ROUTES.default}
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        {generateRoutes(routesConfig)}
        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.default} />} />
    </Routes>
  );
};

export default Routing;
