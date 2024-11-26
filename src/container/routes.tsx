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
const IncidentList = lazy(() => import('../pages/IncidentManagement/index'));
const IncidentView = lazy(() => import('../components/module/incidentManagement/ViewIncident'));
const TrainingList = lazy(() => import('../pages/ClientManagement/index'));
const TrainingAdd = lazy(() => import('../components/module/trainingManagement/AddEditTraining'));
const TrainingView = lazy(() => import('../components/module/trainingManagement/ViewTraining'));
const ResourcesList = lazy(() => import('../pages/ResourcesManagement'));
const ResourceAdd = lazy(() => import('../components/module/resourcesManagement/AddEditResource'));
const ResourceView = lazy(() => import('../components/module/resourcesManagement/ViewResource'));
const CMSList = lazy(() => import('../pages/CMSManagement'));
const SupportCallNumber = lazy(() => import('../pages/SupportCallNumber'));
const TermsAndCondition = lazy(() => import('../components/module/cmsManagement/TermsCondition'));
const EditTermsAndCondition = lazy(
  () => import('../components/module/cmsManagement/EditTermsCondition')
);
const MyProfile = lazy(() => import('../pages/MyProfile'));
const EditMyProfile = lazy(() => import('../components/module/profileEdit'));
const ContentFormView = lazy(
  () => import('components/module/ConsentFormManagement/ConsentFormView')
);
const ConsentFormManagement = lazy(() => import('pages/ConsentForms'));

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

        <Route path={ROUTES.consentForm} element={<Outlet />}>
          <Route path={ROUTES.consentForm} element={<ConsentFormManagement />} />
          <Route path={`${ROUTES.consentFormView}/:id`} element={<ContentFormView />} />
          <Route path="*" element={<Navigate to={ROUTES.consentForm} replace={true} />} />
        </Route>

        <Route path={ROUTES.clientManagement} element={<Outlet />}>
          <Route path={ROUTES.clientManagement} element={<ClientList />} />
          <Route path={`${ROUTES.clientView}/:id`} element={<ClientView />} />
          <Route path="*" element={<Navigate to={ROUTES.clientManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.incidentManagement} element={<Outlet />}>
          <Route path={ROUTES.incidentManagement} element={<IncidentList />} />
          <Route path={`${ROUTES.incidentView}/:id`} element={<IncidentView />} />
          <Route path="*" element={<Navigate to={ROUTES.incidentManagement} replace={true} />} />
        </Route>

        <Route path={ROUTES.trainingMangement} element={<Outlet />}>
          <Route path={ROUTES.trainingMangement} element={<TrainingList />} />
          <Route path={`${ROUTES.trainingView}/:id`} element={<TrainingView />} />
          <Route path={`${ROUTES.trainingAdd}`} element={<TrainingAdd />} />
          <Route path={`${ROUTES.trainingEdit}/:id`} element={<TrainingAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.trainingMangement} replace={true} />} />
        </Route>

        <Route path={ROUTES.resourcesMangement} element={<Outlet />}>
          <Route path={ROUTES.resourcesMangement} element={<ResourcesList />} />
          <Route path={`${ROUTES.resourcesView}/:id`} element={<ResourceView />} />
          <Route path={`${ROUTES.resourcesAdd}`} element={<ResourceAdd />} />
          <Route path={`${ROUTES.resourcesEdit}/:id`} element={<ResourceAdd />} />
          <Route path="*" element={<Navigate to={ROUTES.resourcesMangement} replace={true} />} />
        </Route>

        <Route path={ROUTES.cms} element={<Outlet />}>
          <Route path={ROUTES.cms} element={<CMSList />} />
          <Route path={`${ROUTES.cms}/:key`} element={<TermsAndCondition />} />
          <Route path={`${ROUTES.editCms}/:key`} element={<EditTermsAndCondition />} />
          <Route path="*" element={<Navigate to={ROUTES.cms} replace={true} />} />
        </Route>

        <Route path={ROUTES.supportCallNumber} element={<SupportCallNumber />} />

        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.default} />} />
    </Routes>
  );
};

export default Routing;
