import { DetailWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Col, Divider, Row, message } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { ICr, ICrReq } from 'services/api/cr/types';
import { useCrDetail, useCrStatus } from 'services/hooks/cr';
import { crKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, ClientStatus, CrStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import CrStatusDropdown from 'utils/renderDropDownStatus/crStatusDropDown';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.crManagement}>Project CR</Link>
  },
  {
    title: 'CR Detail'
  }
];

const ViewCr = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: crData } = useCrDetail(Number(id));
  const { mutate } = useCrStatus();

  const handleConfirm = (newStatus: string, id: number) => {
    const data = {
      status: newStatus,
      crId: id
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate cr list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crList({} as ICrReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in cr detail
        queryClient.setQueryData<ICr>(crKeys.crDetail(Number(id)), () => {
          return { ...res } as unknown as ICr;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">CR Detail</h2>
          <CrStatusDropdown
            status={crData?.status ?? 'not_started'}
            crId={crData?.id ?? 0}
            onStatusChange={(newStatus, crId) => handleConfirm(newStatus, crId)}
          />
        </div>
        <DetailWrapper>
          <Divider orientation="left">Cr Information</Divider>
          <Row className="crRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{crData?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Description</h4>
              <p>{crData?.description ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>{CrStatus.find((item) => item.value == crData?.status)?.label}</p>
            </Col>
            <Col xs={4}>
              <h4>Start Date</h4>
              <p>{crData?.startDate ? dayjs(crData?.startDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>End Date</h4>
              <p>{crData?.endDate ? dayjs(crData?.endDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Assign From Company</Divider>
          <Row className="crRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{crData?.assignFromCompany?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{crData?.assignFromCompany?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Country</h4>
              <p>{crData?.assignFromCompany?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Project Details</Divider>
          <Row className="crRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{crData?.project?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Start Date</h4>
              <p>
                {crData?.project?.startDate
                  ? dayjs(crData?.project?.startDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>End Date</h4>
              <p>
                {crData?.project?.endDate
                  ? dayjs(crData?.project?.endDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Billing Type</h4>
              <p>
                {BillingType.find((item) => item.value == crData?.project?.billingType)?.label ??
                  '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Hourly Rate</h4>
              <p>{crData?.project?.hourlyMonthlyRate ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Cost</h4>
              <p>{crData?.project?.projectCost ?? '-'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Client Details</Divider>
          <Row className="crRow">
            <Col xs={4}>
              <h4>First Name</h4>
              <p>{crData?.client?.firstName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Last Name</h4>
              <p>{crData?.client?.lastName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{crData?.client?.email}</p>
            </Col>
            <Col xs={4}>
              <h4>Address</h4>
              <p>{crData?.client?.address ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Phone</h4>
              <p>{crData?.client?.phone ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>
                {ClientStatus.find((item) => item.value == crData?.client?.status)?.label ?? '-'}
              </p>
            </Col>
          </Row>
          <Row className="crRow">
            <Col xs={4}>
              <h4>Country</h4>
              <p>{crData?.client?.clientCompanyName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>State</h4>
              <p>{crData?.client?.stateName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>City</h4>
              <p>{crData?.client?.cityName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Cr Cost Information</Divider>
          <Row className="crRow">
            <Col xs={4}>
              <h4>Hourly Rate</h4>
              <p>{crData?.hourlyMonthlyRate ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Cr Hours</h4>
              <p>{crData?.crHours ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Total Cost</h4>
              <p>{crData?.crCost ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Billing Type</h4>
              <p>{BillingType.find((item) => item.value == crData?.billingType)?.label ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Currency</h4>
              <p>{crData?.currency ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewCr;
