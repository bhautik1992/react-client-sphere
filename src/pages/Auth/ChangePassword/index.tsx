import { CheckCircleOutlined, CloseCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderPasswordInput } from 'components/common/FormField';
import ContentHeader from 'components/layout/contentHeader';

import { IChangePasswordForm } from 'services/api/auth/types';
import { useChangePassword } from 'services/hooks/auth';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import pattern from 'utils/constants/pattern';
import { ROUTES } from 'utils/constants/routes';

import { Wrapper } from '../Auth.Styled';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { employeeData } = authStore((state) => state);

  const { mutate } = useChangePassword();

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: false,
    containsUppercase: false,
    containsLowercase: false,
    containsNumber: false,
    containsSymbol: false
  });

  const validatePassword = (value: string) => {
    const validations = {
      minLength: value.length >= 8,
      maxLength: value.length < 15,
      containsUppercase: /[A-Z]/.test(value),
      containsLowercase: /[a-z]/.test(value),
      containsNumber: /\d/.test(value),
      containsSymbol: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]+/.test(value)
    };
    setPasswordValidation(validations);
    return Promise.all([
      Promise.resolve(validations.minLength ? '' : 'Password must be at least 8 characters'),
      Promise.resolve(validations.maxLength ? '' : 'Password must be less then 15 characters'),
      Promise.resolve(
        validations.containsUppercase ? '' : 'Password must contain an uppercase letter'
      ),
      Promise.resolve(
        validations.containsLowercase ? '' : 'Password must contain a lowercase letter'
      ),
      Promise.resolve(validations.containsNumber ? '' : 'Password must contain a number'),
      Promise.resolve(validations.containsSymbol ? '' : 'Password must contain a symbol')
    ]);
  };

  const onSubmit = (value: IChangePasswordForm) => {
    const data = {
      currentPassword: value?.currentPassword,
      newPassword: value?.newPassword,
      id: +employeeData.id
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
      <ContentHeader pageTitle="Change Password" />
      <div className="shadow-paper">
        <Wrapper>
          <div className="formTitle">
            <Form onFinish={onSubmit} form={form} autoComplete="off" className="changePwdForm">
              <Row gutter={[0, 30]} justify={'center'}>
                <RenderPasswordInput
                  col={{ xs: 13 }}
                  name="currentPassword"
                  label="Current Password"
                  required={true}
                  placeholder="Enter current password "
                  type="password"
                  size="middle"
                  prefix={<LockOutlined style={{ color: '#FFC7A0' }} />}
                  rules={[
                    () => ({
                      validator: (_: any, value: string) => {
                        if (!value) {
                          return Promise.reject(new Error('Please enter your current password'));
                        } else if (!pattern.strong_password.test(value)) {
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
                <RenderPasswordInput
                  col={{ xs: 13 }}
                  name="newPassword"
                  required={true}
                  placeholder="Enter new password "
                  type="password"
                  size="middle"
                  label="New Password"
                  prefix={<LockOutlined style={{ color: '#FFC7A0' }} />}
                  rules={[
                    () => ({
                      validator: (_: any, value: string) => {
                        if (value) {
                          validatePassword(value);
                          return Promise.resolve();
                        } else {
                          setPasswordValidation({
                            minLength: false,
                            maxLength: false,
                            containsUppercase: false,
                            containsLowercase: false,
                            containsNumber: false,
                            containsSymbol: false
                          });
                          return Promise.reject(new Error('Please enter your new password'));
                        }
                      }
                    })
                  ]}
                />
                <RenderPasswordInput
                  col={{ xs: 13 }}
                  name="confirmPassword"
                  required={true}
                  placeholder="Enter confirm password "
                  type="password"
                  size="middle"
                  prefix={<LockOutlined style={{ color: '#FFC7A0' }} />}
                  label="Confirm Password"
                  rules={[
                    ({ getFieldValue }: { getFieldValue: any }) => ({
                      validator(_: any, value: any) {
                        if (value && getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        } else if (!value) {
                          return Promise.reject(new Error('Please enter your confirm password'));
                        } else {
                          return Promise.reject(
                            new Error('New password and confirm password do not match')
                          );
                        }
                      }
                    })
                  ]}
                />
                <div className="password-validation">
                  <Row justify={'center'}>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.minLength ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must be at least 8 characters
                      </span>
                    </Col>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.maxLength ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must be less then 15 characters
                      </span>
                    </Col>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.containsUppercase ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must contain an uppercase letter
                      </span>
                    </Col>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.containsLowercase ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must contain a lowercase letter
                      </span>
                    </Col>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.containsNumber ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must contain a number
                      </span>
                    </Col>
                    <Col xs={13}>
                      <span className="valid">
                        {passwordValidation.containsSymbol ? (
                          <CheckCircleOutlined className="success" />
                        ) : (
                          <CloseCircleOutlined className="error" />
                        )}
                        {'  '} Password must contain a symbol
                      </span>
                    </Col>
                  </Row>
                </div>
                <Col xs={13} className="d-flex justify-content-center">
                  <div className="otherAction">
                    <Button
                      type="primary"
                      size="middle"
                      htmlType="submit"
                      disabled={Object.values(passwordValidation).some((e) => !e)}
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default ChangePassword;
