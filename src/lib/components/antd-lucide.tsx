'use client';

import type {
  AlertProps,
  AutoCompleteProps,
  CollapseProps,
  InputNumberProps,
  PaginationProps,
  DatePickerProps,
  DrawerProps,
  ModalProps,
  PopconfirmProps,
  ResultProps,
  SelectProps,
  TimePickerProps,
} from 'antd';
import {
  Alert as AntAlert,
  AutoComplete as AntAutoComplete,
  Collapse as AntCollapse,
  InputNumber as AntInputNumber,
  DatePicker as AntDatePicker,
  Popconfirm as AntPopconfirm,
  Drawer as AntDrawer,
  Modal as AntModal,
  Pagination as AntPagination,
  Result as AntResult,
  Select as AntSelect,
  TimePicker as AntTimePicker,
} from 'antd';
import type { RefSelectProps } from 'antd/es/select';
import { CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, CircleHelp, CircleX, Clock3, Info, TriangleAlert, X } from 'lucide-react';
import { forwardRef } from 'react';

const SelectWithLucideIcon = forwardRef<RefSelectProps, SelectProps<any, any>>(
  (props, ref) => (
    <AntSelect
      {...props}
      ref={ref}
      suffixIcon={
        props.suffixIcon ?? <ChevronDown size={16} strokeWidth={1.8} />
      }
      allowClear={
        props.allowClear === true
          ? { clearIcon: <CircleX size={14} strokeWidth={1.8} /> }
          : props.allowClear
      }
    />
  )
);
SelectWithLucideIcon.displayName = 'Select';

const Select = Object.assign(SelectWithLucideIcon, {
  Option: AntSelect.Option,
  OptGroup: AntSelect.OptGroup,
}) as unknown as typeof AntSelect;

const DatePicker = Object.assign(
  (props: DatePickerProps) => (
    <AntDatePicker
      {...props}
      suffixIcon={
        props.suffixIcon ?? <CalendarDays size={16} strokeWidth={1.8} />
      }
      clearIcon={props.clearIcon ?? <CircleX size={14} strokeWidth={1.8} />}
    />
  ),
  {
    RangePicker: (
      props: React.ComponentProps<typeof AntDatePicker.RangePicker>
    ) => (
      <AntDatePicker.RangePicker
        {...props}
        suffixIcon={
          props.suffixIcon ?? <CalendarDays size={16} strokeWidth={1.8} />
        }
        clearIcon={props.clearIcon ?? <CircleX size={14} strokeWidth={1.8} />}
      />
    ),
  }
) as unknown as typeof AntDatePicker;

const TimePicker = ((props: TimePickerProps) => (
  <AntTimePicker
    {...props}
    suffixIcon={props.suffixIcon ?? <Clock3 size={16} strokeWidth={1.8} />}
  />
)) as unknown as typeof AntTimePicker;

const Modal = Object.assign(
  (props: ModalProps) => (
    <AntModal
      {...props}
      closeIcon={props.closeIcon ?? <X size={18} strokeWidth={1.8} />}
    />
  ),
  {
    ...AntModal,
    confirm: (config: Parameters<typeof AntModal.confirm>[0]) =>
      AntModal.confirm({
        ...config,
        icon: config.icon ?? <CircleHelp size={18} strokeWidth={1.8} />,
      }),
    info: (config: Parameters<typeof AntModal.info>[0]) =>
      AntModal.info({
        ...config,
        icon: config.icon ?? <Info size={18} strokeWidth={1.8} />,
      }),
    success: (config: Parameters<typeof AntModal.success>[0]) =>
      AntModal.success({
        ...config,
        icon: config.icon ?? <CheckCircle2 size={18} strokeWidth={1.8} />,
      }),
    warning: (config: Parameters<typeof AntModal.warning>[0]) =>
      AntModal.warning({
        ...config,
        icon: config.icon ?? <TriangleAlert size={18} strokeWidth={1.8} />,
      }),
    error: (config: Parameters<typeof AntModal.error>[0]) =>
      AntModal.error({
        ...config,
        icon: config.icon ?? <CircleX size={18} strokeWidth={1.8} />,
      }),
  }
) as typeof AntModal;

const Drawer = ((props: DrawerProps) => (
  <AntDrawer
    {...props}
    closeIcon={props.closeIcon ?? <X size={18} strokeWidth={1.8} />}
  />
)) as typeof AntDrawer;

const AutoComplete = ((props: AutoCompleteProps) => (
  <AntAutoComplete
    {...props}
    suffixIcon={
      props.suffixIcon ?? <ChevronDown size={16} strokeWidth={1.8} />
    }
  />
)) as typeof AntAutoComplete;

const InputNumber = ((props: InputNumberProps) => (
  <AntInputNumber
    {...props}
    upHandler={props.upHandler ?? <ChevronUp size={10} strokeWidth={1.8} />}
    downHandler={props.downHandler ?? <ChevronDown size={10} strokeWidth={1.8} />}
  />
)) as typeof AntInputNumber;

const Collapse = Object.assign(
  (props: CollapseProps) => (
    <AntCollapse
      {...props}
      expandIcon={
        props.expandIcon ??
        (({ isActive }) => (
          <ChevronRight
            size={16}
            strokeWidth={1.8}
            className={isActive ? "rotate-90 transition-transform" : "transition-transform"}
          />
        ))
      }
    />
  ),
  { Panel: AntCollapse.Panel }
) as typeof AntCollapse;

const Pagination = ((props: PaginationProps) => (
  <AntPagination
    {...props}
    itemRender={
      props.itemRender ??
      ((_page, type, originalElement) => {
        if (type === "prev") return <ChevronLeft size={16} strokeWidth={1.8} />;
        if (type === "next") return <ChevronRight size={16} strokeWidth={1.8} />;
        return originalElement;
      })
    }
  />
)) as typeof AntPagination;

const Alert = ((props: AlertProps) => {
  const iconByType = {
    success: <CheckCircle2 size={16} strokeWidth={1.8} />,
    info: <Info size={16} strokeWidth={1.8} />,
    warning: <TriangleAlert size={16} strokeWidth={1.8} />,
    error: <CircleX size={16} strokeWidth={1.8} />,
  };
  return <AntAlert {...props} icon={props.icon ?? iconByType[props.type ?? 'info']} />;
}) as typeof AntAlert;

const Popconfirm = ((props: PopconfirmProps) => (
  <AntPopconfirm
    {...props}
    icon={props.icon ?? <CircleHelp size={16} strokeWidth={1.8} />}
  />
)) as typeof AntPopconfirm;

const Result = ((props: ResultProps) => {
  const iconByStatus = {
    success: <CheckCircle2 size={56} strokeWidth={1.5} />,
    info: <Info size={56} strokeWidth={1.5} />,
    warning: <CircleAlert size={56} strokeWidth={1.5} />,
    error: <CircleX size={56} strokeWidth={1.5} />,
    '403': <CircleX size={56} strokeWidth={1.5} />,
    '404': <CircleHelp size={56} strokeWidth={1.5} />,
    '500': <CircleAlert size={56} strokeWidth={1.5} />,
  };
  return <AntResult {...props} icon={props.icon ?? iconByStatus[props.status ?? 'info']} />;
}) as typeof AntResult;

export { Alert, AutoComplete, Collapse, DatePicker, Drawer, InputNumber, Modal, Pagination, Popconfirm, Result, Select, TimePicker };
