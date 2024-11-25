import { DatePickerProps } from 'antd';
import dayjs from 'dayjs';

export const DATE_FORMAT = 'MM/DD/YYYY';
export const WEEK_FORMAT = 'DD/MM';
export const MONTH_FORMAT = 'MM/YYYY';
export const YEAR_FORMAT = 'YYYY';
export const DATE_MONTH_FORMAT = 'Do MMM YYYY';
export const FULL_DATE_TIME = 'MMMM DD, YYYY  hh:mm a';

// custom week selection format
export const customWeekStartEndFormat: DatePickerProps['format'] = (value) =>
  `${dayjs(value).startOf('week').format(WEEK_FORMAT)} ~ ${dayjs(value)
    .endOf('week')
    .format(WEEK_FORMAT)}`;
