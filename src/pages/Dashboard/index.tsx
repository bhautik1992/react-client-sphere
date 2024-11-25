import { Wrapper } from './style';

import { Button, Col, Row, Space } from 'antd';
import dayjs, { OpUnitType } from 'dayjs';
import { useState } from 'react';

import { RenderDatePicker, RenderRangePicker } from 'components/common/FormField';
import Meta from 'components/common/Meta';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ContentHeader from 'components/layout/contentHeader';

import { useDashboard } from 'services/hooks/dashboard';

import {
  DATE_FORMAT,
  MONTH_FORMAT,
  YEAR_FORMAT,
  customWeekStartEndFormat
} from 'utils/constants/dayjs';

const BreadcrumbsPath = [
  {
    title: 'Dashboard'
  }
];

const Dashboard = () => {
  let dateFormate;

  const [dateRange, setDateRange] = useState<dayjs.Dayjs[] | dayjs.Dayjs>([]);
  const [startEndDate, setStartEndDate] = useState<{ startDate?: string; endDate?: string }>({});

  const [selectedMode, setSelectedMode] = useState<string>('overall');

  const { data } = useDashboard(startEndDate);

  const findStartAndEndDate = (
    date: dayjs.Dayjs[] | dayjs.Dayjs,
    mode?: OpUnitType | 'overall'
  ) => {
    const endDate = dayjs(date as dayjs.Dayjs)
      .endOf((mode ?? selectedMode) as OpUnitType)
      .format(DATE_FORMAT);

    const startDate = dayjs(date as unknown as dayjs.Dayjs)
      .startOf((mode ?? selectedMode) as OpUnitType)
      .format(DATE_FORMAT);

    setStartEndDate({
      startDate: startDate,
      endDate: endDate
    });
  };

  const onDateChange = (date: dayjs.Dayjs[] | dayjs.Dayjs) => {
    if (Array.isArray(date)) {
      setStartEndDate({
        startDate: dayjs(date?.[0]).format(DATE_FORMAT),
        endDate: dayjs(date?.[1]).format(DATE_FORMAT)
      });
    } else {
      findStartAndEndDate(date);
    }
    setDateRange(date);
  };

  const handleModeChange = (mode: string) => {
    if (mode === selectedMode) return;

    setSelectedMode(mode);

    if (mode !== 'overall') {
      setDateRange([dayjs(new Date())]);
      findStartAndEndDate(
        [dayjs(new Date() as unknown as dayjs.Dayjs)],
        mode as OpUnitType | 'overall'
      );
    } else {
      setDateRange([dayjs(new Date())]);
      setStartEndDate({});
    }
  };

  if (dateRange && startEndDate) {
    // Extract the selected date based on the mode
    if (selectedMode === 'week') {
      dateFormate = customWeekStartEndFormat;
    } else if (selectedMode === 'month') {
      dateFormate = MONTH_FORMAT;
    } else if (selectedMode === 'year') {
      dateFormate = YEAR_FORMAT;
    } else {
      // Overall (no specific date)
      dateFormate = null;
    }
  }
  return (
    <>
      <Meta title="Building Bridges Application - Dashboard" />
      <Wrapper>
        <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
        <ContentHeader pageTitle="Dashboard" />
        <div className="shadow-paper">
          <Row>
            <Col xs={24}>
              <Space direction="horizontal" className="d-flex justify-content-end mb-12" size={12}>
                <Button
                  type={selectedMode === 'week' ? 'primary' : 'text'}
                  onClick={() => handleModeChange('week')}
                >
                  Week
                </Button>
                <Button
                  type={selectedMode === 'month' ? 'primary' : 'text'}
                  onClick={() => handleModeChange('month')}
                >
                  Month
                </Button>
                <Button
                  type={selectedMode === 'year' ? 'primary' : 'text'}
                  onClick={() => handleModeChange('year')}
                >
                  Year
                </Button>
                <Button
                  type={selectedMode === 'overall' ? 'primary' : 'text'}
                  onClick={() => handleModeChange('overall')}
                >
                  Overall
                </Button>
                {selectedMode !== 'overall' ? (
                  <RenderDatePicker
                    onChange={onDateChange}
                    value={dateRange}
                    picker={selectedMode}
                    format={dateFormate}
                    allowClear={false}
                  />
                ) : (
                  <RenderRangePicker onChange={onDateChange} value={dateRange} allowClear={false} />
                )}
              </Space>
            </Col>

            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.incidentCount ?? '00'}</span>
                <h2 className="infoTitle">Incident Reports</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.userCount ?? '00'}</span>
                <h2 className="infoTitle">Subscribers</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.volunteerCount ?? '00'}</span>
                <h2 className="infoTitle">Responders</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.pendingIncidentCount ?? '00'}</span>
                <h2 className="infoTitle">Pending Reports</h2>
              </div>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </>
  );
};

export default Dashboard;
