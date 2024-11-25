import { Wrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Row, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderCKEditor } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { ICMSEditReq } from 'services/api/cms/types';
import { useCmsDetail, useCmsEdit } from 'services/hooks/cms';
import { cmsKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

const EditTermsAndCondition = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { key } = useParams();

  const { data, isLoading } = useCmsDetail(key ?? '');
  const { mutate } = useCmsEdit();

  const handleEditorChange = (_: any, editor: any) => {
    const content = editor.getData();

    if (content.trim() === '') {
      form.setFieldsValue({ ['content']: null });
    } else {
      form.setFieldsValue({ ['content']: content });
    }
  };
  const onSubmit = (value: { content: string }) => {
    const data: ICMSEditReq = {
      key: key ?? '',
      content: value?.content
    };
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(cmsKey.cmsDetail(key ?? ''));
        navigate(`${ROUTES.cms}/${key}`);
      },
      onError: (err: IApiError) => {
        message.error(err?.message);
      }
    });
  };

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.cms}>CMS Management</Link>
    },
    {
      title: key === 'termsAndConditions' ? 'Terms And Condition' : 'Privacy Policy'
    }
  ];
  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{data?.name}</h2>
        </div>
        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderCKEditor
              name="content"
              rules={[
                {
                  required: true,
                  message: 'Please enter your content'
                }
              ]}
              data={data?.content}
              onChange={(e: any, editor: any) => handleEditorChange(e, editor)}
            />
            <Col xs={24}>
              <Button type="primary" size="middle" htmlType="submit" disabled={isLoading}>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Wrapper>
  );
};

export default EditTermsAndCondition;
