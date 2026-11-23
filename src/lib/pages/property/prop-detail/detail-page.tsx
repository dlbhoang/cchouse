"use client";

import { Alert, Button, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyDetailDialog from "@/lib/components/admin/property/detail-dialog";
import RequestAccess from "@/lib/components/admin/property/request-access";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import type { IPropAccess } from "@/services/property";
import propertyApi from "@/services/api/property/propertyApi";
import PropertyFormModal from ".";

export default function PropertyDetailPage({ id }: { id: number }) {
  const router = useRouter();
  const query = useSearchParams();
  const [data, setData] = useState<IPropResponse>();
  const [access, setAccess] = useState<IPropAccess>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    setData(undefined);
    setAccess(undefined);
    const fetchDetail = async () => {
      try {
        const permission = await propertyApi.checkPropAccess(id);
        if (!active) return;
        setAccess(permission.data);
        if (permission.data.IsAllowed) {
          const result = await propertyApi.getById(id);
          if (!result.data?.Id) throw new Error("Property not found");
          if (active) setData(result.data);
        }
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchDetail();
    return () => { active = false; };
  }, [id, revision]);

  const goBack = () => {
    const returnTo = query?.get("returnTo");
    if (returnTo?.startsWith("/admin/") && !returnTo.includes("\\")) router.push(returnTo);
    else router.push(`/admin/property?TransType=${data?.TransType ?? 1}`);
  };

  if (loading) return <div className="property-detail-dialog-loading"><Spin size="large" /></div>;
  if (failed) return <Alert type="error" message="Không tải được bất động sản" action={<><Button onClick={() => setRevision(value => value + 1)}>Thử lại</Button><Button onClick={goBack}>Quay lại</Button></>} />;
  if (access && !access.IsAllowed) return <RequestAccess model={access} onClose={goBack} />;

  return <>
    <PropertyDetailDialog open data={data} onClose={goBack} onEdit={() => setEditing(true)} />
    <PropertyFormModal open={editing} id={id} onClose={() => setEditing(false)} onSuccess={() => setRevision(value => value + 1)} />
  </>;
}
