import dayjs from 'dayjs';
import { ETimeFilter } from './enum';

interface DateRange {
  fromDate: dayjs.Dayjs;
  toDate: dayjs.Dayjs;
}

export function parseTimeFilterToDateRange(timeFilter: ETimeFilter): DateRange {
  const now = dayjs();

  let fromDate: dayjs.Dayjs;
  let toDate: dayjs.Dayjs;

  switch (timeFilter) {
    case ETimeFilter.WEEK:
      // Tuần này: từ thứ 2 đến chủ nhật
      fromDate = now.startOf('week').add(1, 'day'); // Thứ 2
      toDate = now.endOf('week').add(1, 'day'); // Chủ nhật
      break;

    case ETimeFilter.LAST_WEEK:
      // Tuần trước: từ thứ 2 đến chủ nhật
      fromDate = now.subtract(1, 'week').startOf('week').add(1, 'day'); // Thứ 2 tuần trước
      toDate = now.subtract(1, 'week').endOf('week').add(1, 'day'); // Chủ nhật tuần trước
      break;

    case ETimeFilter.MONTH:
      // Tháng này: từ ngày 1 đến ngày cuối tháng
      fromDate = now.startOf('month');
      toDate = now.endOf('month');
      break;

    case ETimeFilter.LAST_MONTH:
      // Tháng trước: từ ngày 1 đến ngày cuối tháng
      fromDate = now.subtract(1, 'month').startOf('month');
      toDate = now.subtract(1, 'month').endOf('month');
      break;

    case ETimeFilter.QUARTER:
      // Quý này: từ tháng đầu quý đến tháng cuối quý
      const currentQuarter = Math.floor(now.month() / 3);
      const quarterStartMonth = currentQuarter * 3;
      fromDate = now.month(quarterStartMonth).startOf('month');
      toDate = now.month(quarterStartMonth + 2).endOf('month');
      break;

    case ETimeFilter.YEAR:
      // Năm này: từ 1/1 đến 31/12
      fromDate = now.startOf('year');
      toDate = now.endOf('year');
      break;

    default:
      throw new Error(`Invalid time filter: ${timeFilter}`);
  }

  return { fromDate, toDate };
}

// Hàm helper để format date thành string yyyy-mm-dd
export function formatDateRangeToString(dateRange: DateRange): {
  fromDate: string;
  toDate: string;
} {
  return {
    fromDate: dateRange.fromDate.format('YYYY-MM-DD'),
    toDate: dateRange.toDate.format('YYYY-MM-DD'),
  };
}

// Hàm convenience để lấy date range và format thành string trong một lần gọi
export function getTimeFilterDateRange(timeFilter: ETimeFilter): {
  fromDate: string;
  toDate: string;
} {
  const dateRange = parseTimeFilterToDateRange(timeFilter);
  return formatDateRangeToString(dateRange);
}
