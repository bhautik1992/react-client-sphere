import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, message } from 'antd';
import { Wrapper } from 'pages/Auth/Auth.Styled';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import AuthLayout from 'components/common/AuthLayout';
import { RenderCheckBox, RenderPasswordInput, RenderTextInput } from 'components/common/FormField';
import Meta from 'components/common/Meta';

import { useSignIn } from 'services/hooks/auth';
import { authStore } from 'services/store/auth';
import { ILoginApiParam } from 'services/store/auth/types';

import { IApiError } from 'utils/Types';
import validation from 'utils/constants/pattern';
import { ROUTES } from 'utils/constants/routes';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { isLoggedIn } = authStore((state) => state);
  const { mutate, isLoading } = useSignIn();
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = ({ email, password }: ILoginApiParam) => {
    const loginData = {
      email: email,
      password: password
    };
    mutate(loginData, {
      onSuccess: () => {
        navigate(ROUTES.dashboard);
      },

      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  if (isLoggedIn) {
    return <Navigate to={ROUTES.dashboard} />;
  }

  return (
    <>
      <Meta title="Client Sphere - Sign In" />
      <AuthLayout>
        <Wrapper>
          <div className="formTitle">
            <h4 className="title">Login</h4>
            <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
              <Row gutter={[0, 30]}>
                <RenderTextInput
                  col={{ xs: 24 }}
                  name="email"
                  placeholder="Enter your email id "
                  // label="Email ID"
                  allowClear="allowClear"
                  size="large"
                  prefix={<UserOutlined style={{ color: '#0000ff' }} />}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email'
                    },
                    {
                      type: 'email',
                      message: 'Please enter valid email'
                    }
                  ]}
                />
                <RenderPasswordInput
                  col={{ xs: 24 }}
                  name="password"
                  required={true}
                  placeholder="Enter your password "
                  type="password"
                  size="middle"
                  prefix={<LockOutlined style={{ color: '#0000ff' }} />}
                  rules={[
                    () => ({
                      validator: (_: any, value: string) => {
                        if (!value) {
                          return Promise.reject(new Error('Please enter your password'));
                        } else if (!validation.strong_password.test(value)) {
                          return Promise.reject(
                            new Error(
                              'Password must be of 8 to 15 characters and contains 1 uppercase, 1 lowercase, 1 number and 1 special character.'
                            )
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    })
                  ]}
                />
                <Col xs={24}>
                  <div className="otherAction">
                    <RenderCheckBox
                      name="isRemember"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    >
                      Remember me
                    </RenderCheckBox>
                    {/* <Link to={ROUTES?.forgotPassword}>Forgot your password?</Link> */}
                  </div>
                </Col>
                <Col xs={24}>
                  <Button type="primary" size="middle" htmlType="submit" disabled={isLoading}>
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Wrapper>
      </AuthLayout>
    </>
  );
};

export default SignIn;
