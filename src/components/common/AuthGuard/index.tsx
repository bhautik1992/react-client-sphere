import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authStore } from 'services/store/auth';

import { ROUTES } from 'utils/constants/routes';

import { Loader } from '../loader';

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, roles }) => {
  const navigate = useNavigate();
  const { isLoggedIn, employeeData } = authStore((state) => state);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.signIn, { replace: true });
    } else if (roles && !roles.includes(employeeData.role)) {
      navigate(ROUTES.pageNotFound, { replace: true });
    }
  }, [isLoggedIn, navigate, roles, employeeData.role]);

  return isLoggedIn && (!roles || roles.includes(employeeData.role)) ? <>{children}</> : <Loader />;
};

export default AuthGuard;
