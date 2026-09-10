import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  type UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PersonalForm from "@/lib/components/admin/userAdmin/form/personal";
import UserAccessForm from "@/lib/components/admin/userAdmin/form/userAccess";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import MyCard from "@/lib/components/shared/MyCard";
import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { appConst } from "@/lib/core/configs/appConst";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { FormatDateSubmit } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { fileServices } from "@/services/api/services/fileServices";
import type {
  IUserAdminQU,
  IUserAdminRequest,
  IUserAdminResponse,
} from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import { NotiBase } from "@/lib/components/shared/NotiBase";

type Props = {
  model?: IUserAdminResponse;
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
  onRejected: () => void;
};

const PendingReviewModal = ({
  model,
  open,
  onClose,
  onCompleted,
  onRejected,
}: Props) => {
  const { data: session } = useSession();
  const { enumList } = useAdminContext();
  const [detail, setDetail] = useState<IUserAdminResponse>();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [rejectStatus, setRejectStatus] = useState<number>();
  const [activationOpen, setActivationOpen] = useState(false);
  const [activationForm] = Form.useForm<IUserAdminRequest>();
  const reviewData = detail ?? model;
  const identityImages = fileServices.mapFromString(reviewData?.IdentityImages) ?? [];

  useEffect(() => {
    if (!open || !model?.Id) return;
    setDetail(model);
    const loadDetail = async () => {
      try {
        const result = await userAdminApi.getById(model.Id as number);
        if (result.data) setDetail(result.data);
      } catch {
        setDetail(model);
      }
    };
    loadDetail();
  }, [model?.Id, open]);

  useEffect(() => {
    setRejectStatus(4);
  }, [enumList.UserStatus]);

  useEffect(() => {
    if (!reviewData?.Id || !activationOpen) return;
    const emailParts = reviewData.Email?.split("@");
    activationForm.setFieldsValue({
      ...reviewData,
      Email: emailParts?.[0] ?? reviewData.Email,
      EmailExt: emailParts?.[1] ? `@${emailParts[1]}` : "",
      Avatar: fileServices.mapFromString(reviewData.Avatar),
      IdentityImages: fileServices.mapFromString(reviewData.IdentityImages),
      Images: fileServices.mapFromString(reviewData.Images),
      DateOfBirth: reviewData.DateOfBirth ? dayjs(reviewData.DateOfBirth) : undefined,
      UserAccess: reviewData.UserAccess
        ? {
            ...reviewData.UserAccess,
            DateStart: reviewData.UserAccess.DateStart
              ? dayjs(reviewData.UserAccess.DateStart)
              : undefined,
            TimeFrom: reviewData.UserAccess.TimeFrom
              ? dayjs(reviewData.UserAccess.TimeFrom, appConst.TIME_FORMAT)
              : dayjs("07:00", appConst.TIME_FORMAT),
            TimeTo: reviewData.UserAccess.TimeTo
              ? dayjs(reviewData.UserAccess.TimeTo, appConst.TIME_FORMAT)
              : dayjs("18:00", appConst.TIME_FORMAT),
          }
        : undefined,
    });
  }, [activationForm, activationOpen, reviewData]);

  const openActivation = () => {
    setActivationOpen(true);
  };

  const activate = async (values: IUserAdminRequest) => {
    if (!reviewData?.Id) return;
    setLoading(true);
    try {
      if (Array.isArray(values.Images) && values.Images.length > 0) {
        values.Images = fileServices.processFiles(values.Images as UploadFile[]);
      }
      if (values.IdentityImages) {
        values.IdentityImages = fileServices.processFiles(
          values.IdentityImages as UploadFile[]
        );
      }
      if (values.Avatar) {
        values.Avatar = fileServices
          .processFiles(values.Avatar as UploadFile[])
          .toString();
      }

      await userAdminApi.active({
        ...values,
        Id: reviewData.Id,
        Email: `${values.Email}${values.EmailExt ?? ""}`,
        DateOfBirth: FormatDateSubmit(
          values.DateOfBirth?.toString() ?? reviewData.DateOfBirth
        ),
        UserAccess: values.UserAccess
          ? {
              ...values.UserAccess,
              DateStart: FormatDateSubmit(
                values.UserAccess.DateStart?.toString() ??
                  reviewData.UserAccess?.DateStart?.toString()
              ),
              TimeFrom: dayjs(values.UserAccess.TimeFrom).format("HH:mm:ss"),
              TimeTo: dayjs(values.UserAccess.TimeTo).format("HH:mm:ss"),
            }
          : undefined,
      });
      onCompleted();
      setActivationOpen(false);
      onClose();
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.response?.data?.message ??
        "Dữ liệu kích hoạt chưa hợp lệ, vui lòng kiểm tra lại biểu mẫu.";
      NotiBase("error", message);
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (
      !detail?.Id ||
      !reason.trim() ||
      rejectStatus === undefined ||
      !appConst.MANAGER_ROLES.includes(session?.user.RoleId ?? 0)
    )
      return;
    setLoading(true);
    try {
      await userAdminApi.quickUpdate({
        Id: detail.Id,
        Status: rejectStatus,
        Evaluation: reason.trim(),
        Note: reason.trim(),
        Rank: detail.Rank,
        ShowWebsite: detail.ShowWebsite,
        RejectedById: session?.user.Id,
        RejectedByName: session?.user.Name,
        RejectedReason: reason.trim(),
        RejectedAt: new Date().toISOString(),
      } as IUserAdminQU);
      setReason("");
      setRejectOpen(false);
      onRejected();
      onCompleted();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        title="Thông tin đăng ký tài khoản"
        width={900}
        onCancel={onClose}
        footer={
          <Space>
            <Button
              danger
              disabled={!appConst.MANAGER_ROLES.includes(session?.user.RoleId ?? 0)}
              onClick={() => setRejectOpen(true)}
            >
              Từ chối
            </Button>
            <Button type="primary" onClick={openActivation}>
              Chấp nhận
            </Button>
          </Space>
        }
      >
        {reviewData && (
          <>
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="Mã">{reviewData.Code}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{reviewData.Name}</Descriptions.Item>
              <Descriptions.Item label="Email">{reviewData.Email}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{reviewData.Phone}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {enumList.Sex.find((item) => item.Value === reviewData.Sex)?.Name}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dayjs(reviewData.DateOfBirth).format(appConst.DATE_FORMAT)}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{reviewData.Address}</Descriptions.Item>
            </Descriptions>
            <Typography.Title level={5}>Ảnh mặt trước/mặt sau CCCD</Typography.Title>
            {identityImages.length > 0 ? (
              <ImagesPreview images={identityImages} imgWidth={260} />
            ) : (
              <Typography.Text type="secondary">Chưa có ảnh CCCD</Typography.Text>
            )}
          </>
        )}
      </Modal>
      <Modal
        open={activationOpen}
        title="Kích hoạt tài khoản"
        width={1000}
        centered
        destroyOnClose
        confirmLoading={loading}
        onCancel={() => setActivationOpen(false)}
        onOk={() => activationForm.submit()}
        okText="Kích hoạt"
        cancelText="Đóng"
      >
        <Form
          form={activationForm}
          layout="vertical"
          onFinish={activate}
          onFinishFailed={globalHandleFailed(activationForm)}
          autoComplete="off"
          disabled={loading}
        >
          <Form.Item name="Id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="Email" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="EmailExt" hidden>
            <Input />
          </Form.Item>
          <Card>
            <Row gutter={[12, 12]}>
              <Col xs={24} lg={12}>
                <MyCard title="1. Thông tin cá nhân">
                  <PersonalForm form={activationForm} hideAvatar={false} />
                </MyCard>
              </Col>
              <Col xs={24} lg={12}>
                <MyCard title="2. Thông tin hoạt động">
                  <UserAccessForm form={activationForm} />
                </MyCard>
              </Col>
              <Col xs={24}>
                <MyCard title="3. Hồ sơ">
                  <Typography.Text type="secondary">* tối đa 10 hình</Typography.Text>
                  <UploadItem
                    maxCount={10}
                    form={activationForm}
                    name="Images"
                    multiple
                    model={{ TableName: ETableName.User }}
                    accept="image/*"
                  />
                </MyCard>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
      <Modal
        open={rejectOpen}
        title="Lý do từ chối"
        okText="Xác nhận từ chối"
        cancelText="Quay lại"
        okButtonProps={{ danger: true, disabled: !reason.trim(), loading }}
        onCancel={() => setRejectOpen(false)}
        onOk={reject}
      >
        <Input.TextArea
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Nhập lý do từ chối hồ sơ"
        />
      </Modal>
    </>
  );
};

export default PendingReviewModal;