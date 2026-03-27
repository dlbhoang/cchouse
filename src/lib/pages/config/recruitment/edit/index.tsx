"use client";
import { useEffect, useState } from "react";
import RecruitmentForm from "@/lib/components/admin/recruitment/form";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { IRecruitmentResponse } from "@/services/api/recruitment/IRecruitment";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";

type Props = {
  id: number;
};

const EditRecruitmentPage = ({ id }: Props) => {
  const [data, setData] = useState<IRecruitmentResponse>();

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await recruitmentApi.getById(Number(id));
        setData(res.data);
      }
    };
    fetch();
  }, [id]);
  return (
    <>
      <TitlePage title="Chỉnh sửa tin tuyển dụng" />
      <RecruitmentForm model={data} />
    </>
  );
};

export default EditRecruitmentPage;
