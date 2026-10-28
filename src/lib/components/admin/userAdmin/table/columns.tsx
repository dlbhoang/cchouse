import { Avatar, Image, Space, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { CheckCircleIcon, EllipsisVerticalIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import { FormatDate } from '@/lib/core/utils/myFormat';
import { IEnumItem } from '@/lib/interfaces/base/ISelectListBase';
import { IUserAdminResponse } from '@/services/api/userAdmin/IUserAdmin';

const { Text } = Typography;

function safeDisplayValue(value: unknown, fallback = '—') {
  if (typeof value !== 'string' && typeof value !== 'number') return fallback;
  const text = String(value).trim();
  if (
    !text ||
    /^(?:(?:undefined|null|nan)\s*(?:[-–,/|]\s*)?)+$/i.test(text)
  ) {
    return fallback;
  }
  return text;
}

type CellLinkProps = {
  record: IUserAdminResponse;
  onReview: (item: IUserAdminResponse) => void;
  children: React.ReactNode;
};

const UserAdminCellLink = ({ record, onReview, children }: CellLinkProps) => {
  if (record.Status === 3) {
    return (
      <a
        href="#review"
        onClick={(event) => {
          event.preventDefault();
          onReview(record);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={`${AppRoutes.userAdmin.url}/${record.Id}`}>{children}</Link>
  );
};

type Props = {
  status?: number;
  literacyOptions: IEnumItem[];
  onEdit: (item: IUserAdminResponse) => void;
  onReview: (item: IUserAdminResponse) => void;
};

export const columns = ({
  status,
  literacyOptions,
  onEdit,
  onReview,
}: Props): ColumnsType<IUserAdminResponse> => [
  {
    title: 'Mã nhân viên',
    dataIndex: 'Code',
    width: 110,
    sorter: true,
    render(value, record) {
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text strong>{safeDisplayValue(value)}</Text>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Tên nhân viên',
    dataIndex: 'Name',
    width: 165,
    render(value, record) {
      const literacy = literacyOptions.find(
        (option) => Number(option.Value) === Number(record.Literacy),
      )?.Name;

      return (
        <Space size={10}>
          {record.Avatar && (
            <Avatar
              src={
                <Image
                  height="100%"
                  style={{ objectFit: 'cover' }}
                  src={record.Avatar.toString()}
                />
              }
              size={38}
            />
          )}
          <Space direction="vertical" size={0}>
            <UserAdminCellLink record={record} onReview={onReview}>
              <Text>{safeDisplayValue(value, 'Chưa cập nhật')}</Text>
            </UserAdminCellLink>
            <Text type="secondary" className="text-xs">
              {safeDisplayValue(literacy, 'Chưa cập nhật')}
            </Text>
            {record.ShowWebsite && (
              <Tooltip title="Hiển thị trang chủ">
                <CheckCircleIcon className="size-4 text-green-500" />
              </Tooltip>
            )}
          </Space>
        </Space>
      );
    },
  },
  {
    title: 'Ngày sinh / Giới tính',
    dataIndex: 'DateOfBirth',
    width: 115,
    render(value, record) {
      const gender = record.Sex === 1 ? 'Nam' : record.Sex === 2 ? 'Nữ' : 'Khác';
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Space direction="vertical" size={0}>
            <Text>{value ? FormatDate(value) : 'Chưa cập nhật'}</Text>
            <Text type="secondary" className="text-xs">{gender}</Text>
          </Space>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Quản lý',
    dataIndex: 'ManagerName',
    width: 130,
    render(value, record) {
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text>{safeDisplayValue(value, 'Chưa phân công')}</Text>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Chức vụ',
    dataIndex: 'RoleName',
    width: 140,
    render(value, record) {
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text>{safeDisplayValue(value, 'Chưa cập nhật')}</Text>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Phòng ban',
    dataIndex: 'Id',
    width: 110,
    render(_value, record) {
      const department = (record as IUserAdminResponse & { Department?: string })
        .Department;
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text type="secondary">{safeDisplayValue(department, 'Chưa cập nhật')}</Text>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Quyền lợi',
    dataIndex: 'Salary',
    width: 130,
    render(value, record) {
      const benefits = [
        safeDisplayValue(value, '' ) !== '' ? 'Lương' : '',
        Number(record.Commission) > 0 ? `Hoa hồng ${record.Commission}%` : '',
        record.Insurrance ? 'Bảo hiểm' : '',
      ].filter(Boolean);
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text>{benefits.length ? benefits.join(', ') : 'Chưa cập nhật'}</Text>
        </UserAdminCellLink>
      );
    },
  },
  {
    title: 'Ngày làm việc',
    dataIndex: 'WorkStartDate',
    width: 110,
    render(_value, record) {
      const workStartDate = (record as IUserAdminResponse & { WorkStartDate?: string })
        .WorkStartDate;
      return (
        <UserAdminCellLink record={record} onReview={onReview}>
          <Text type="secondary">
            {workStartDate ? FormatDate(workStartDate) : 'Chưa cập nhật'}
          </Text>
        </UserAdminCellLink>
      );
    },
  },
  ...(status === 4
    ? [
        {
          title: 'Lý do từ chối',
          dataIndex: 'RejectedReason',
          width: 240,
          render: (value: string | undefined, record: IUserAdminResponse) =>
            record.Status === 4 ? (
              <Space direction="vertical" size={0}>
                <Text>{value || record.Note || 'Không có lý do'}</Text>
                <Text type="secondary">
                  {record.RejectedByName || 'Không rõ người từ chối'}
                </Text>
                <Text type="secondary">
                  {record.RejectedAt
                    ? dayjs(record.RejectedAt).format('DD-MM-YYYY HH:mm:ss')
                    : 'Chưa có ngày giờ'}
                </Text>
              </Space>
            ) : null,
        },
      ]
    : []),
  ...(status !== 4
    ? [
        {
          title: 'Thao tác',
          dataIndex: 'Id',
          width: 100,
          render: (_value: number | undefined, record: IUserAdminResponse) => {
            return (
              <Space size={4}>
                {record.Phone ? (
                  <Tooltip title={`Gọi ${record.Phone}`}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Gọi ${record.Name}`}
                      onClick={() => window.open(`tel:${record.Phone}`, '_self')}
                    >
                      <PhoneIcon />
                    </Button>
                  </Tooltip>
                ) : null}
                {record.Status === 3 ? (
                  <a
                    href="#review"
                    onClick={(event) => {
                      event.preventDefault();
                      onReview(record);
                    }}
                  >
                    Kích hoạt
                  </a>
                ) : (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onEdit(record)}
                    aria-label={`Thao tác với ${record.Name}`}
                  >
                    <EllipsisVerticalIcon />
                  </Button>
                )}
              </Space>
            );
          },
        },
      ]
    : []),
];
