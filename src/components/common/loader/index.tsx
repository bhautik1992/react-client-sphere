import { Spinner, Wrapper } from './style';

import { LoadingIcon } from 'components/svg';

interface IProps {
  children?: React.ReactNode;
}

export const LoaderWrapper: React.FC<IProps> = ({ children }) => {
  return <>{children}</>;
};

export const Loader: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Wrapper>
        <Spinner>
          <LoadingIcon />
        </Spinner>
        {children}
      </Wrapper>
      {children}
    </>
  );
};
