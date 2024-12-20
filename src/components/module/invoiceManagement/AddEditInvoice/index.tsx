import { ButtonWrapper, TableWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Divider, Form, Input, InputRef, Row, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { ICr, ICrInvoiceAmt } from 'services/api/cr/types';
import { IAddInvoiceReq, IInvoiceReq } from 'services/api/invoice/types';
import { useCrDetailByProductId } from 'services/hooks/cr';
import {
  useDashboardClient,
  useDashboardCompany,
  useDashboardProject
} from 'services/hooks/dashboard';
import { useAddInvoice, useInvoiceDetail } from 'services/hooks/invoice';
import { crKeys, invoiceKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, COMPANY_EMAIL, CrStatusName, ProjectStatusName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditInvoice = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddInvoice();
  const { data: invoiceData } = useInvoiceDetail(Number(id));
  const [projectId, setProjectId] = useState<number>();
  const [crListData, setCrListData] = useState<ICr[]>([]);
  const { data: crList } = useCrDetailByProductId(Number(projectId));
  const [selectedCrIds, setSelectedCrIds] = useState<number[]>([]);
  const [projectListOption, setProjectListOption] = useState<{ label: string; value: number }[]>(
    []
  );
  const [crInvoiceAmount, setCrInvoiceAmount] = useState<ICrInvoiceAmt[]>([]);
  const inputRefs = useRef<{ [key: number]: InputRef | null }>({});

  const { data: companyList } = useDashboardCompany();
  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: projectList } = useDashboardProject();
  const { data: clientList } = useDashboardClient();
  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const handleClientChange = (clientId: number) => {
    form.setFieldsValue({
      clientCompanyName: clientList?.find((item) => item.id === clientId)?.clientCompanyName,
      projectId: null
    });
    const filteredProjects = projectList
      ?.filter(
        (project) => project.client.id === clientId && project.status === ProjectStatusName.Started
      )
      .map((item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
    setProjectListOption(filteredProjects || []);
  };

  useEffect(() => {
    if (crList && crList.length > 0) {
      const crListData = crList.filter(
        (item) => item.isInvoiced === false && item.status === CrStatusName.Started
      );
      setCrListData(crListData);
    }
  }, [crList]);

  const handleProjectChange = (projectId: number) => {
    setProjectId(projectId);
  };

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.invoiceManagement);
  };

  const onSubmit = (value: IAddInvoiceReq) => {
    if (selectedCrIds.length === 0) {
      message.error('There are no CRs pending for invoice.');
      return;
    }
    value.crIds = selectedCrIds;
    value.crInvoiceAmount = crInvoiceAmount;
    return addInvoice(value);
  };

  const setCrCostChange = (crId: number, newAmount: number) => {
    setCrInvoiceAmount((prevData: ICrInvoiceAmt[]) => {
      const updatedData = prevData.map((item) => {
        if (item.id === crId) {
          return { ...item, crCost: newAmount };
        }
        return item;
      });
      if (!updatedData.some((item) => item.id === crId)) {
        updatedData.push({ id: crId, crCost: newAmount });
      }
      return updatedData;
    });
  };

  const handleCheckboxChange = (e: any, cr: ICr, invoicedAmount: string) => {
    const isChecked = e.target.checked;
    setSelectedCrIds((prevSelectedCrIds) => {
      const updatedCrIds = isChecked
        ? [...prevSelectedCrIds, cr.id]
        : prevSelectedCrIds.filter((id) => id !== cr.id);
      return updatedCrIds;
    });
    if (isChecked) {
      setCrCostChange(cr.id, +invoicedAmount);
    } else {
      const crInvoiceAmountUpdate = crInvoiceAmount.filter((item) => item.id !== cr.id);
      setCrInvoiceAmount(crInvoiceAmountUpdate);
    }
  };

  const handleCrCostChange = (e: React.ChangeEvent<HTMLInputElement>, crId: number) => {
    const newAmount = +e.target.value;
    setCrCostChange(crId, newAmount);
  };

  const addInvoice = (value: IAddInvoiceReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate invoice list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [invoiceKeys.invoiceList({} as IInvoiceReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crDetailByProductId(Number(projectId))].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [invoiceKeys.invoiceByProjectId(Number(projectId))].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      companyId: companyList?.find((item) => item.email === COMPANY_EMAIL)?.id,
      invoiceDate: dayjs(new Date())
    });
    if (!invoiceData) return;
    form.setFieldsValue({
      customInvoiceNumber: invoiceData?.customInvoiceNumber ?? '',
      invoiceDate: invoiceData?.invoiceDate ? dayjs(invoiceData?.invoiceDate) : null,
      dueDate: invoiceData?.dueDate ? dayjs(invoiceData?.dueDate) : null,
      companyId: invoiceData?.companyId ?? null,
      clientId: invoiceData?.clientId ?? null,
      clientCompanyName: invoiceData?.client.clientCompanyName ?? null,
      projectId: invoiceData?.projectId ?? null,
      additionalAmount: invoiceData?.additionalAmount ?? null,
      additionalChargeDesc: invoiceData?.additionalChargeDesc ?? null
    });
  }, [invoiceData, form, companyList, crInvoiceAmount]);

  const crTableColumns: ColumnsType<ICr> = [
    {
      title: 'Select',
      dataIndex: 'select',
      key: 'select',
      render: (_, record: ICr) => (
        <Checkbox
          onChange={(e) =>
            handleCheckboxChange(e, record, inputRefs.current[record.id]?.input?.value ?? '0')
          }
          checked={selectedCrIds.includes(record.id)}
        />
      )
    },
    {
      title: 'CR Title',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Billing Type',
      dataIndex: 'billingType',
      key: 'billingType',
      render: (_, record: ICr) => (
        <>{BillingType.find((item) => item.value === record.billingType)?.label ?? '-'}</>
      )
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (_, record: ICr) => <>{record?.currency ?? '-'}</>
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyMonthlyRate',
      key: 'hourlyMonthlyRate',
      sorter: false,
      render: (_, record: ICr) => <>{record?.hourlyMonthlyRate ?? '-'}</>
    },
    {
      title: 'Cr Hours',
      dataIndex: 'crHours',
      key: 'crHours',
      sorter: false,
      render: (_, record: ICr) => <>{record?.crHours ?? '-'}</>
    },
    {
      title: 'Total Cost',
      dataIndex: 'crCost',
      key: 'crCost',
      sorter: false,
      render: (_, record: ICr) => <>{record?.crCost ?? '-'}</>
    },
    {
      title: 'Invoiced Amount',
      dataIndex: 'invoicedAmount',
      key: 'invoicedAmount',
      sorter: false,
      render: (_, record: ICr) => {
        const isDisabled = !selectedCrIds.includes(record.id);
        return (
          <Input
            defaultValue={record.crCost}
            disabled={isDisabled}
            onChange={(e) => handleCrCostChange(e, record.id)}
            ref={(el) => (inputRefs.current[record.id] = el)}
          />
        );
      }
    }
  ];

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.invoiceManagement}>Invoices</Link>
    },
    {
      title: id ? 'Edit Invoice' : 'Add Invoice'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Invoice' : 'Add Invoice'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Divider orientation="left">Invoice Information</Divider>
            <RenderSelectInput
              col={{ xs: 12 }}
              name="companyId"
              placeholder="Select company"
              label="Company"
              allowClear={true}
              optionLabel={companyListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select parent company'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="clientId"
              placeholder="Select client"
              label="Client"
              allowClear={true}
              optionLabel={clientListOption}
              onSelect={handleClientChange}
              rules={[
                {
                  required: true,
                  message: 'Please select client'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="clientCompanyName"
              placeholder="Client company name"
              label="Client Company"
              allowClear={true}
              disabled={true}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="projectId"
              placeholder="Select project"
              label="Select Project"
              optionLabel={projectListOption}
              onChange={handleProjectChange}
              rules={[
                {
                  required: true,
                  message: 'Please select project'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="customInvoiceNumber"
              placeholder="Enter custom invoice number"
              label="Custom Invoice No."
              allowClear="allowClear"
              size="middle"
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isAfter(new Date())}
              name="invoiceDate"
              placeholder="Select invoice date"
              label="Invoice Date"
              allowClear="allowClear"
              size="middle"
              defaultValue={dayjs(new Date())}
              format={DATE_FORMAT}
              rules={[
                {
                  required: true,
                  message: 'Please select invoice date'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isBefore(new Date())}
              name="dueDate"
              placeholder="Select invoice due date"
              label="Due Date"
              allowClear="allowClear"
              size="middle"
              format={DATE_FORMAT}
            />
            <Divider orientation="left">Add Addition Charges</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="additionalAmount"
              placeholder="Enter Additional Amount"
              label="Amount"
              allowClear="allowClear"
              size="middle"
              onChange={(e: any) => {
                const amt = parseFloat(e.target.value) || 0;
                form.setFieldsValue({
                  additionalAmount: amt
                });
              }}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="additionalChargeDesc"
              placeholder="Enter description"
              label="Charges Description"
              allowClear="allowClear"
              size="middle"
            />
          </Row>
          {crListData && crListData.length > 0 && (
            <Row>
              <TableWrapper>
                <Divider orientation="left">Particulars</Divider>
                <Table
                  columns={crTableColumns}
                  dataSource={crListData}
                  pagination={false}
                  rowKey="id"
                />
              </TableWrapper>
            </Row>
          )}
          <Row justify={'center'}>
            <ButtonWrapper>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                className="submitButton"
                type="primary"
                size="middle"
                htmlType="submit"
                disabled={isLoading}
              >
                {invoiceData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditInvoice;
