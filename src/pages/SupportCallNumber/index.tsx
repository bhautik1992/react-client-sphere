import { Wrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { RenderPhoneNumber } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useCmsDetail, useCmsEdit } from 'services/hooks/cms';
import { cmsKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';

const BreadcrumbsPath = [
  {
    title: 'Support Call Number'
  }
];

const SupportCallNumber = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>('');
  const supportKey = 'contactNumberForApp';
  const { data } = useCmsDetail(supportKey);
  const { mutate, isLoading } = useCmsEdit();

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      ['phoneNumber']: data?.content ?? ''
    });
  }, [form, data]);

  const onSubmit = (value: { phoneNumber: string }) => {
    const data = {
      key: supportKey,
      content: value?.phoneNumber
    };
    mutate(data, {
      onSuccess: (res) => {
        queryClient.setQueryData(cmsKey.cmsDetail(supportKey), () => {
          return { ...res };
        });
      },

      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Support Call Number</h2>
        </div>
        <Form form={form} onFinish={onSubmit} className="supportCallFrm">
          <Row gutter={[0, 30]}>
            <RenderPhoneNumber
              col={{ xs: 12 }}
              name="phoneNumber"
              placeholder="Enter your support call number "
              onChange={(value: any) => setValue(value)}
              value={value}
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
                    if (!value || isPossiblePhoneNumber(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('Please enter valid support call number'));
                    }
                  }
                })
              ]}
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

export default SupportCallNumber;
