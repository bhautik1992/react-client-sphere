import { Wrapper } from './style';

import { Button } from 'antd';
import React, { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.log('error: ', error);
    // It will update the state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // It will catch errors in any component below. You can also log the error to an error reporting service.
    console.error('Error info:', info);
    console.error('Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper className="error-page">
          <div className="error-content">
            <h3>Oops, Something is wrong ...</h3>
            <p>Please Refresh</p>
            <Button className="glow-on-hover" type="primary">
              <a href={'/'}>Go Back</a>
            </Button>
          </div>
        </Wrapper>
      );
    }
    return this.props.children;
  }
}
