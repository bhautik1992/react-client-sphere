import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IProfileEditReq } from 'services/api/profile/types';
import { useProfileDetail, useProfileEdit } from 'services/hooks/profile';
import { profileKey } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

const EditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actions, userData } = authStore.getState();
  console.log('userData: ', userData);
  const { data } = useProfileDetail(userData.id);
  const { mutate } = useProfileEdit();

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      ['firstName']: data?.first_name ?? '',
      ['lastName']: data?.last_name ?? '',
      ['email']: data?.email ?? ''
    });
  }, [form, data]);

  const onSubmit = (value: any) => {
    const editData: IProfileEditReq = {
      id: data?.id ?? 0,
      email: value?.email,
      first_name: value?.firstName,
      last_name: value?.lastName
    };

    mutate(editData, {
      onSuccess: (res) => {
        navigate(ROUTES.myProfile);
        queryClient.invalidateQueries(profileKey.profileDetail);
        actions.authSuccess({
          data: { ...userData, ...res, access_token: userData?.access_token }
        });
      },
      onError: (err: IApiError) => {
        message.error(err?.message);
      }
    });
  };

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.myProfile}>My Profile</Link>
    },
    {
      title: 'Edit Profile'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Edit Profile</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderTextInput
              col={{ xs: 12 }}
              name="firstName"
              placeholder="Enter your first name"
              label="First Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your first name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="lastName"
              placeholder="Enter your last name"
              label="Last Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your last name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="email"
              placeholder="Enter your email address"
              label="Email Address"
              allowClear="allowClear"
              size="middle"
              disabled={true}
              rules={[
                {
                  required: true,
                  message: 'Please enter your email address'
                }
              ]}
            />
          </Row>

          <Row justify={'center'} gutter={[0, 30]}>
            <Button className="mt-20" type="primary" size="middle" htmlType="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default EditProfile;
