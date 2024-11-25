import { ButtonWrapper } from './style';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Row, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import ImageUpload from 'components/common/ImageUpload';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import {
  IAddEditFormValues,
  IAddEditReq,
  IResourceReq,
  IResourceType
} from 'services/api/resources/types';
import { resourceKeys } from 'services/hooks/queryKeys';
import {
  useAddEditResource,
  useResourceDetail,
  useResourceTYpeList,
  useUploadProfile
} from 'services/hooks/resource';

import { IApiError } from 'utils/Types';
import pattern from 'utils/constants/pattern';
import { ROUTES } from 'utils/constants/routes';

const AddEditResource = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data: resourceTypeList } = useResourceTYpeList();
  const { mutate, isLoading } = useAddEditResource();
  const { data } = useResourceDetail(id ?? '');
  const { mutate: mutateUploadImage, isLoading: isImageUploadLoading } = useUploadProfile();

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [selectTypeOption, setSelectTypeOption] = useState<IResourceType | null>(null);
  const [showImageError, setShowImageError] = useState<boolean>(false);

  const resourceTypeListOptions = resourceTypeList?.result.map((resource: any) => ({
    label: resource.title,
    value: resource._id
  }));

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      title: data.title ?? '',
      url: data.url ?? '',
      types: {
        resourceTypeId: data.resourceType._id
      }
    });
    setImagePath(data?.resourceType?.image);
  }, [data, form]);

  useEffect(() => {
    if (!imagePath ?? !selectTypeOption) return;
    setShowImageError(false);
  }, [imagePath, selectTypeOption]);

  const onSubmit = (value: IAddEditFormValues) => {
    if (!imagePath ?? !data?.resourceType?.imageSignUrl) {
      setShowImageError(true);
      return;
    }

    const formData: IAddEditReq = {
      title: value.title,
      url: value.url,
      image: imagePath ?? data?.resourceType?.image
    };

    if (id) formData.resourceId = id;
    if (Array.isArray(value.types) && value.types[0].newResourceType)
      formData.newResourceType = value.types[0].newResourceType;
    if (!Array.isArray(value.types) && value.types.resourceTypeId)
      formData.resourceTypeId = value.types.resourceTypeId;

    mutate(formData, {
      onSuccess: () => {
        navigate(ROUTES.resourcesMangement);
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [resourceKeys.resourceList({} as IResourceReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // invalidate resource type list
        queryClient.invalidateQueries(resourceKeys.resourceTypeList);
        queryClient.invalidateQueries(resourceKeys.resourceDetail(id ?? ''));
      },
      onError: (err: IApiError) => {
        message.error(err?.message);
      }
    });
  };

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.resourcesMangement}>Resources Management</Link>
    },
    {
      title: id ? 'Edit Resource Program' : 'Add Resource Program'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Resource Program' : 'Add Resource Program'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Form.List name="types">
              {(fields, { add, remove }) => (
                <>
                  <RenderSelectInput
                    col={{ xs: 18 }}
                    name="resourceTypeId"
                    placeholder="Enter your resource type"
                    label="Resource Type"
                    optionLabel={resourceTypeListOptions}
                    onChange={(e: string) => {
                      setSelectTypeOption(
                        resourceTypeList?.result.find((a) => a._id === e) ?? null
                      );
                      setImagePath(
                        resourceTypeList?.result.find((a) => a._id === e)?.image ?? null
                      );
                    }}
                    rules={[
                      {
                        required: !fields?.length,
                        message: 'Please enter your resource type'
                      }
                    ]}
                    disabled={fields?.length === 1 || Boolean(id)}
                  />
                  {fields.map(({ key, name }) => (
                    <Col xs={24} key={key} className="d-flex">
                      <RenderTextInput
                        col={18}
                        label="New resource type"
                        name={[name, 'newResourceType']}
                        placeholder="Enter new resource type "
                        rules={[
                          {
                            required: fields?.length,
                            message: 'Please enter your new resource type'
                          }
                        ]}
                      />
                      <Tooltip title="Remove new resource type">
                        <MinusCircleOutlined onClick={() => remove(name)} className="ml-12" />
                      </Tooltip>
                    </Col>
                  ))}
                  {fields?.length < 1 && !id && (
                    <Col xs={18} className="d-flex justify-content-end">
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add new resource type
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
            </Form.List>

            <Col xs={18}>
              <Row>
                <Col xs={6} className="d-flex justify-content-end">
                  <label style={{ marginRight: '10px' }}>Image : </label>
                </Col>
                <ImageUpload
                  maxCount={1}
                  profileUrl={
                    data?.resourceType?.imageSignUrl ?? selectTypeOption?.imageSignUrl ?? ''
                  }
                  setImagepath={setImagePath}
                  mutate={mutateUploadImage}
                />
              </Row>
            </Col>
            {showImageError && (
              <Col xs={18} className="mt-15p">
                <Row className="d-flex justify-content-end">
                  <Col xs={18}>
                    <span className="w-100 text-danger ">Resource image is required</span>
                  </Col>
                </Row>
              </Col>
            )}
            <RenderTextInput
              col={{ xs: 18 }}
              name="title"
              placeholder="Enter your resource title"
              label="Resource Title"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter resource title'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="url"
              placeholder="Enter your resource URL"
              label="Resource URL"
              allowClear="allowClear"
              size="middle"
              required
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('Please enter your resource URL'));
                    } else if (!pattern.url.test(value)) {
                      return Promise.reject(new Error('Enter valid URL'));
                    } else {
                      return Promise.resolve();
                    }
                  }
                })
              ]}
            />
          </Row>

          <Row justify={'center'}>
            <ButtonWrapper>
              <Button
                className="submitButton"
                type="primary"
                size="middle"
                htmlType="submit"
                disabled={isImageUploadLoading ?? isLoading}
              >
                Submit
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditResource;
