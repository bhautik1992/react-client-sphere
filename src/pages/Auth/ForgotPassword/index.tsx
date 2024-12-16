import { UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, message } from 'antd';
import { Wrapper } from 'pages/Auth/Auth.Styled';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from 'components/common/AuthLayout';
import { RenderTextInput } from 'components/common/FormField';
import Meta from 'components/common/Meta';

import { Role } from 'services/api/types';
import { useForgotPassword } from 'services/hooks/auth';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate } = useForgotPassword();
  const onSubmit = (value: { email: string }) => {
    const data = {
      email: value?.email,
      employeeType: Role?.ADMIN
    };
    mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.signIn);
      },

      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <>
      <Meta title="Client Sphere - Forgot Password" />
      <AuthLayout>
        <Wrapper>
          <div className="formTitle">
            <h4 className="title">Forgot Password</h4>
            <Form onFinish={onSubmit} form={form} autoComplete="off" className="forgotPwdForm">
              <Row gutter={[0, 30]}>
                <RenderTextInput
                  col={{ xs: 24 }}
                  name="email"
                  placeholder="Enter email id here..."
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
                <Col xs={24}>
                  <div className="otherAction">
                    <Button type="primary" size="middle" htmlType="submit">
                      Submit
                    </Button>
                    <Link to={ROUTES?.signIn}>Back to login</Link>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Wrapper>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
