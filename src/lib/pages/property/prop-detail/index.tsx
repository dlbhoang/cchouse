"use client";

import { Button, Modal, Row, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropAddEdit from "@/lib/components/admin/property/form/propAddEdit";
import RequestAccess from "@/lib/components/admin/property/request-access";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import { IPropAccess } from "@/services/property";
import PropertyDetailView from "./property-detail-view";
import "./property-detail.css";

type QueryParams = {
  AddressNumber?: string;
  ProvinceId?: string;
  DistrictId?: string;
  WardId?: string;
  StreetId?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  id?: number;
  transType?: ETransType;
  query?: QueryParams;
};

const PropertyFormModal = ({
  open,
  onClose,
  onSuccess,
  id,
  transType = ETransType.sell,
  query,
}: Props) => {
  const router = useRouter();
  const [data, setData] = useState<IPropResponse>();
  const [accessInfo, setAccessInfo] = useState<IPropAccess>();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      setAccessInfo(undefined);
      setIsEditing(false);
      return;
    }

    if (!id) {
      setIsEditing(true);
      return;
    }

    setIsEditing(false);

    const fetchAccessInfo = async () => {
      setLoading(true);
      try {
        const result = await propertyApi.checkPropAccess(Number(id));
        setAccessInfo(result.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessInfo();
  }, [id, open]);

  useEffect(() => {
    if (!open || !id || !accessInfo?.IsAllowed) {
      if (!open || !id) setData(undefined);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await propertyApi.getById(Number(id));
        setData(result.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessInfo, id, open]);

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const propId = data?.Id ?? accessInfo?.Prop?.Id;
  const modalTitle = isEdit
    ? propId
      ? `CHI TIẾT BẤT ĐỘNG SẢN - MÃ BĐS: ${propId}`
      : "CHI TIẾT BẤT ĐỘNG SẢN"
    : "Thêm bất động sản mới";

  const showRequestAccess =
    isEdit && accessInfo && !accessInfo.IsAllowed && !loading;
  const showDetailView =
    isEdit && accessInfo?.IsAllowed && data && !isEditing && !loading;
  const showForm =
    !isEdit || (accessInfo?.IsAllowed && data && isEditing && !loading);

  const detailFooter =
    showDetailView && data ? (
      <Row justify="end" gutter={12} className="prop-detail-footer">
        <Button size="large" onClick={() => setIsEditing(true)}>
          Chỉnh sửa
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={() =>
            router.push(`${AppRoutes.feed.url}/add?propId=${data.Id}`)
          }
        >
          Đăng tin
        </Button>
      </Row>
    ) : null;

  return (
    <Modal
      title={modalTitle}
      open={open}
      width="95vw"
      className="property-detail-modal"
      style={{ top: 16, maxWidth: 1400 }}
      styles={{ body: { maxHeight: "calc(100vh - 180px)", overflowY: "auto" } }}
      onCancel={onClose}
      footer={detailFooter}
      destroyOnClose
      centered={false}
    >
      {loading && (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      )}

      {showDetailView && data && <PropertyDetailView data={data} />}

      {!loading && showForm && (
        <PropAddEdit
          model={data}
          transType={isEdit ? data?.TransType : transType}
          query={query}
          inModal
          onClose={onClose}
          onSuccess={handleSuccess}
        />
      )}

      {!loading && showRequestAccess && (
        <RequestAccess model={accessInfo} onClose={onClose} />
      )}
    </Modal>
  );
};

export default PropertyFormModal;
