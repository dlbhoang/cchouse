import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import React from "react";

import { appConst } from "@/lib/core/configs/appConst";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";

const NewsDateFilter = ({
  form,
  onValueChange,
}: {
  form: ReturnType<typeof Form.useForm<INewsOpts>>[0];
  onValueChange?: () => void;
}) => {
  const fromDateWatch = Form.useWatch("fromDate", form);

  const presetDays = [3, 7, 30];

  const setPreset = (days: number) => {
    const date = dayjs().subtract(days, "day");
    const formatted = date.format(appConst.SUBMIT_DATE_FORMAT);

    form.setFieldValue("fromDate", formatted);
    form.setFieldValue("toDate", formatted);

    onValueChange?.();
  };

  return (
    <>
      <DatePicker
        popupClassName="news-date-picker-popup"
        value={fromDateWatch ? dayjs(fromDateWatch) : null}
        format={appConst.DATE_FORMAT}
        placeholder="Chọn ngày"
        allowClear
        onChange={(date) => {
          if (!date) {
            form.setFieldValue("fromDate", undefined);
            form.setFieldValue("toDate", undefined);
          } else {
            const formatted = date.format(appConst.SUBMIT_DATE_FORMAT);

            form.setFieldValue("fromDate", formatted);
            form.setFieldValue("toDate", formatted);
          }

          onValueChange?.();
        }}
        panelRender={(panel) => (
          <div className="news-date-picker-wrapper">
            <div className="news-date-picker-presets">
              {presetDays.map((day) => (
                <button key={day} type="button" onClick={() => setPreset(day)}>
                  {day} ngày trước
                </button>
              ))}
            </div>

            {panel}
          </div>
        )}
      />

      <style>{`
        .news-date-picker-popup {
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden !important;
        }

        .news-date-picker-wrapper {
          width: 240px;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
        }

        /* Fix khoảng trắng / hở góc */
        .news-date-picker-popup .ant-picker-panel-layout,
        .news-date-picker-popup .ant-picker-date-panel,
        .news-date-picker-popup .ant-picker-body {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        /* Presets */
        .news-date-picker-presets {
          display: flex;
          gap: 6px;
          padding: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .news-date-picker-presets button {
          flex: 1;
          border: none;
          background: #f3f4f6;
          padding: 5px 6px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .news-date-picker-presets button:hover {
          background: #e0f2fe;
          color: #0588f0;
        }

        /* Calendar panel */
        .news-date-picker-popup .ant-picker-panel {
          border: none !important;
          box-shadow: none !important;
        }

        .news-date-picker-popup .ant-picker-header {
          padding: 6px 8px;
          border-bottom: none;
        }

        .news-date-picker-popup .ant-picker-header-view {
          font-size: 12px;
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
      `}</style>
    </>
  );
};

export default NewsDateFilter;