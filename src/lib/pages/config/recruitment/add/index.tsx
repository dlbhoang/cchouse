"use client";
import RecruitmentForm from "@/lib/components/admin/recruitment/form";
import TitlePage from "@/lib/core/layout/components/TitlePage";

const AddRecruitmentPage = () => {
  return (
    <>
      <TitlePage title="Thêm tin tuyển dụng" />
      <RecruitmentForm />
    </>
  );
};

export default AddRecruitmentPage;
