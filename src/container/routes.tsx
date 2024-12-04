import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import AuthGuard from '../components/common/AuthGuard';

import { ROUTES } from 'utils/constants/routes';

const Layout = lazy(() => import('../components/layout'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const SignIn = lazy(() => import('../pages/Auth/SignIn'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ChangePassword = lazy(() => import('../pages/Auth/ChangePassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UsersList = lazy(() => import('../pages/UsersManagement'));
const UserView = lazy(() => import('../components/module/usersManagement/ViewUser'));
const UserAdd = lazy(() => import('../components/module/usersManagement/AddEditUser'));
const ClientList = lazy(() => import('../pages/ClientManagement/index'));
const ClientView = lazy(() => import('../components/module/clientManagement/ViewClient'));
const ClientAdd = lazy(() => import('../components/module/clientManagement/AddEditClient'));
const ProjectList = lazy(() => import('../pages/ProjectManagement/index'));
const ProjectView = lazy(() => import('../components/module/projectManagement/ViewProject'));
const CompanyList = lazy(() => import('../pages/CompanyManagement/index'));
const CompanyView = lazy(() => import('../components/module/companyManagement/ViewCompany'));
const MyProfile = lazy(() => import('../pages/MyProfile'));
const EditMyProfile = lazy(() => import('../components/module/profileEdit'));

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
        <Route path={ROUTES.pageNotFound} element={<PageNotFound />} />
        <Route path={ROUTES.changePassword} element={<ChangePassword />} />
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.myProfile} element={<MyProfile />} />
        <Route path={ROUTES.editMyProfile} element={<EditMyProfile />} />

        <Route path={ROUTES.usersManagement} element={<Outlet />}>
          <Route path={ROUTES.usersManagement} element={<UsersList />} />
          <Route path={`${ROUTES.usersView}/:id`} element={<UserView />} />
          <Route path={`${ROUTES.usersAdd}`} element={<UserAdd />} />
          <Route path={`${ROUTES.usersEdit}/:id`} element={<UserAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.usersManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.clientManagement} element={<Outlet />}>
          <Route path={ROUTES.clientManagement} element={<ClientList />} />
          <Route path={`${ROUTES.clientView}/:id`} element={<ClientView />} />
          <Route path={`${ROUTES.clientAdd}`} element={<ClientAdd />} />
          <Route path={`${ROUTES.clientEdit}/:id`} element={<ClientAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.clientManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.projectManagement} element={<Outlet />}>
          <Route path={ROUTES.projectManagement} element={<ProjectList />} />
          <Route path={`${ROUTES.projectView}/:id`} element={<ProjectView />} />
          <Route path="*" element={<Navigate to={ROUTES.projectManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.companyManagement} element={<Outlet />}>
          <Route path={ROUTES.companyManagement} element={<CompanyList />} />
          <Route path={`${ROUTES.companyView}/:id`} element={<CompanyView />} />
          <Route path="*" element={<Navigate to={ROUTES.companyManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.default} />} />
    </Routes>
  );
};

export default Routing;
