import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { appConst } from "@/lib/core/configs/appConst";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";

const NewsDateFilter = ({
  form,
  onValueChange,
}: {
  form: ReturnType<typeof Form.useForm<INewsOpts>>[0];
  onValueChange?: (values: Pick<INewsOpts, "fromDate" | "toDate">) => void;
}) => {
  const fromDateWatch = Form.useWatch("fromDate", form);
  const toDateWatch = Form.useWatch("toDate", form);
  const [open, setOpen] = useState(false);
  const ignoreNextClearRef = useRef(false);
  const [selectingEnd, setSelectingEnd] = useState(
    Boolean(fromDateWatch && (!toDateWatch || dayjs(fromDateWatch).isSame(dayjs(toDateWatch), "day")))
  );
  const [pickerValue, setPickerValue] = useState(fromDateWatch ? dayjs(fromDateWatch) : dayjs());
  const presetDays = [0, 3, 7, 30];
  const presetLabel = (days: number) => (days === 0 ? "Hôm nay" : `${days} ngày trước`);

  const submitDateFilter = (fromDate?: string, toDate?: string) =>
    onValueChange?.({ fromDate, toDate });

  const setPreset = (days: number) => {
    const date = dayjs().subtract(days, "day");
    ignoreNextClearRef.current = true;
    form.setFieldsValue({
      fromDate: date.format(appConst.SUBMIT_DATE_FORMAT),
      toDate: dayjs().format(appConst.SUBMIT_DATE_FORMAT),
    });
    setSelectingEnd(days === 0);
    setOpen(false);
    submitDateFilter(
      date.format(appConst.SUBMIT_DATE_FORMAT),
      dayjs().format(appConst.SUBMIT_DATE_FORMAT)
    );
  };

  const isSingleDate = Boolean(
    fromDateWatch && toDateWatch && dayjs(fromDateWatch).isSame(dayjs(toDateWatch), "day")
  );

  const handleDateSelect = (date: dayjs.Dayjs) => {
    const hasSingleDate = Boolean(
      fromDateWatch && toDateWatch && dayjs(fromDateWatch).isSame(dayjs(toDateWatch), "day")
    );

    if ((!selectingEnd && !hasSingleDate) || !fromDateWatch) {
      const selectedDate = date.format(appConst.SUBMIT_DATE_FORMAT);
      form.setFieldsValue({ fromDate: selectedDate, toDate: selectedDate });
      setSelectingEnd(true);
      setPickerValue(date);
      submitDateFilter(selectedDate, selectedDate);
      return;
    }

    const start = dayjs(fromDateWatch);
    const from = date.isBefore(start, "day") ? date : start;
    const to = date.isBefore(start, "day") ? start : date;
    const fromValue = from.format(appConst.SUBMIT_DATE_FORMAT);
    const toValue = to.format(appConst.SUBMIT_DATE_FORMAT);
    form.setFieldsValue({ fromDate: fromValue, toDate: toValue });
    setSelectingEnd(false);
    setOpen(false);
    submitDateFilter(fromValue, toValue);
  };

  return (
    <>
      <DatePicker
        popupClassName="news-date-picker-popup"
        open={open}
        value={selectingEnd
          ? (toDateWatch ? dayjs(toDateWatch) : fromDateWatch ? dayjs(fromDateWatch) : null)
          : (fromDateWatch ? dayjs(fromDateWatch) : null)}
        pickerValue={pickerValue}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            const start = fromDateWatch ? dayjs(fromDateWatch) : dayjs();
            setPickerValue(start);
            setSelectingEnd(
              Boolean(
                fromDateWatch &&
                  (!toDateWatch || dayjs(fromDateWatch).isSame(dayjs(toDateWatch), "day"))
              )
            );
          }
        }}
        onPanelChange={(nextMonth) => setPickerValue(nextMonth)}
        placeholder="Chọn khoảng ngày"
        allowClear
        onChange={(date) => {
          if (!date) {
            if (ignoreNextClearRef.current) {
              ignoreNextClearRef.current = false;
              return;
            }
            form.setFieldsValue({ fromDate: undefined, toDate: undefined });
            setSelectingEnd(false);
            submitDateFilter(undefined, undefined);
            return;
          }

          handleDateSelect(date);
        }}
        format={() => {
          if (isSingleDate) return dayjs(fromDateWatch).format(appConst.DATE_FORMAT);
          if (fromDateWatch && toDateWatch) {
            return `${dayjs(fromDateWatch).format(appConst.DATE_FORMAT)} - ${dayjs(toDateWatch).format(appConst.DATE_FORMAT)}`;
          }
          if (fromDateWatch) return `${dayjs(fromDateWatch).format(appConst.DATE_FORMAT)} - Đến ngày`;
          return "";
        }}
        panelRender={(panel) => (
          <div className="news-date-picker-wrapper">
            <div className="news-date-picker-presets">
              {presetDays.map((day) => (
                <button key={day} type="button" onClick={() => setPreset(day)}>
                  {presetLabel(day)}
                </button>
              ))}
            </div>
            <div className="news-date-picker-hint">
              {selectingEnd ? "Chọn ngày kết thúc" : "Chọn ngày bắt đầu"}
            </div>
            {panel}
          </div>
        )}
      />

      <style>{`
        .news-date-picker-popup {
          width: 300px !important;
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden !important;
        }

        .news-date-picker-wrapper {
          width: 100%;
          min-width: 0;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
        }

        .news-date-picker-popup .ant-picker-panel-layout {
          display: flex !important;
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          background: white !important;
        }

        .news-date-picker-popup .ant-picker-body,
        .news-date-picker-popup .ant-picker-content {
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          background: white !important;
        }

        /* Calendar panel */
        .news-date-picker-popup .ant-picker-panel {
          border: none !important;
          box-shadow: none !important;
        }

        .news-date-picker-presets {
          display: flex;
          gap: 6px;
          padding: 8px;
          border-bottom: 1px solid #e0f2fe;
          background: #f8fcff;
        }

        .news-date-picker-presets button {
          flex: 1;
          border: none;
          background: #ffffff;
          padding: 5px 6px;
          border-radius: 6px;
          color: #475569;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
          cursor: pointer;
        }

        .news-date-picker-presets button:hover {
          background: #e0f2fe;
          color: #0588f0;
        }

        .news-date-picker-hint {
          padding: 6px 8px 0;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.4;
        }

        .news-date-picker-popup .ant-picker-header {
          padding: 10px 8px 8px;
          border-bottom: none;
        }

        .news-date-picker-popup .ant-picker-header-view {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
        }

        .news-date-picker-popup .ant-picker-header-view button {
          padding: 4px 7px;
          border-radius: 6px;
          color: #0f172a;
        }

        .news-date-picker-popup .ant-picker-header-view button:hover {
          background: #e8f4fe;
          color: #0588f0;
        }

        .news-date-picker-popup .ant-picker-content {
          width: 100%;
        }

        /* Weekday */
        .news-date-picker-popup .ant-picker-content th {
          color: #9ca3af;
          font-weight: 500;
          font-size: 11px;
          padding-bottom: 4px;
        }

        /* Day cell */
        .news-date-picker-popup .ant-picker-cell {
          padding: 1px 0;
        }

        .news-date-picker-popup .ant-picker-cell-inner {
          width: 22px;
          height: 22px;
          line-height: 22px;
          font-size: 12px;
          border-radius: 6px !important;
        }

        /* Month picker: keep "Th 01" on one line instead of inheriting the
           compact day-cell width and wrapping the label. */
        .news-date-picker-popup .ant-picker-month-panel .ant-picker-content {
          table-layout: fixed;
        }

        .news-date-picker-popup .ant-picker-month-panel .ant-picker-cell-inner {
          width: 72px;
          height: 42px;
          line-height: 42px;
          font-size: 14px;
          white-space: nowrap;
          border-radius: 8px !important;
        }

        .news-date-picker-popup .ant-picker-month-panel .ant-picker-cell {
          padding: 4px 0;
        }

        .news-date-picker-popup
          .ant-picker-cell-selected
          .ant-picker-cell-inner {
          background: #0588f0 !important;
          color: white !important;
        }

        .news-date-picker-popup
          .ant-picker-cell:hover
          .ant-picker-cell-inner {
          background: #e0f2fe !important;
        }

        /* Remove today border */
        .news-date-picker-popup
          .ant-picker-cell-today
          .ant-picker-cell-inner::before {
          display: none !important;
        }

        /* Body spacing */
        .news-date-picker-popup .ant-picker-body {
          padding: 6px 8px !important;
        }

        /* Footer */
        .news-date-picker-popup .ant-picker-footer {
          border-top: none !important;
          padding: 4px 0;
        }

        @media (max-width: 576px) {
          .news-date-picker-popup {
            width: min(300px, calc(100vw - 32px)) !important;
          }

          .news-date-picker-popup .ant-picker-panel {
            min-width: 0 !important;
          }

          .news-date-picker-popup .ant-picker-panels {
            overflow-x: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default NewsDateFilter;
