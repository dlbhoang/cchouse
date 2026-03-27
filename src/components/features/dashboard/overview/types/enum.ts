export enum EGroupType {
  DAY,
  MONTH,
}

export enum ETimeFilter {
  WEEK = 'week',
  LAST_WEEK = 'last_week',
  MONTH = 'month',
  LAST_MONTH = 'last_month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

// mapping enum to label
export const ETimeFilterLabel = {
  [ETimeFilter.WEEK]: 'Tuần này',
  [ETimeFilter.LAST_WEEK]: 'Tuần trước',
  [ETimeFilter.MONTH]: 'Tháng này',
  [ETimeFilter.LAST_MONTH]: 'Tháng trước',
  [ETimeFilter.QUARTER]: 'Quý này',
  [ETimeFilter.YEAR]: 'Năm này',
};

//convert to array options for select
export const ETimeFilterOptions = Object.values(ETimeFilter).map((value) => ({
  label: ETimeFilterLabel[value],
  value,
}));

export const getEGroupTypeByETimeFilter = (timeFilter: ETimeFilter) => {
  switch (timeFilter) {
    case ETimeFilter.QUARTER:
      return EGroupType.MONTH;
    case ETimeFilter.YEAR:
      return EGroupType.MONTH;
    default:
      return EGroupType.DAY;
  }
};
