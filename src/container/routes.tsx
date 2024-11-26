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
const ClientList = lazy(() => import('../pages/ClientManagement/index'));
const ClientView = lazy(() => import('../components/module/clientManagement/ViewClient'));
const TrainingList = lazy(() => import('../pages/TrainingManagement/index'));
const TrainingAdd = lazy(() => import('../components/module/trainingManagement/AddEditTraining'));
const TrainingView = lazy(() => import('../components/module/trainingManagement/ViewTraining'));
const UsersList = lazy(() => import('../pages/UsersManagement'));
const UserAdd = lazy(() => import('../components/common/Modal/AddUserModal'));
const UserView = lazy(() => import('../components/module/usersManagement/ViewUser'));
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

        <Route path={ROUTES.clientManagement} element={<Outlet />}>
          <Route path={ROUTES.clientManagement} element={<ClientList />} />
          <Route path={`${ROUTES.clientView}/:id`} element={<ClientView />} />
          <Route path="*" element={<Navigate to={ROUTES.clientManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.trainingMangement} element={<Outlet />}>
          <Route path={ROUTES.trainingMangement} element={<TrainingList />} />
          <Route path={`${ROUTES.trainingView}/:id`} element={<TrainingView />} />
          <Route path={`${ROUTES.trainingAdd}`} element={<TrainingAdd />} />
          <Route path={`${ROUTES.trainingEdit}/:id`} element={<TrainingAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.trainingMangement} replace={true} />} />
        </Route>

        <Route path={ROUTES.usersManagement} element={<Outlet />}>
          <Route path={ROUTES.usersManagement} element={<UsersList />} />
          <Route path={`${ROUTES.usersView}/:id`} element={<UserView />} />
          <Route path={`${ROUTES.usersAdd}`} element={<UserAdd />} />
          <Route path={`${ROUTES.usersEdit}/:id`} element={<UserAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.usersManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.default} />} />
    </Routes>
  );
};

export default Routing;
