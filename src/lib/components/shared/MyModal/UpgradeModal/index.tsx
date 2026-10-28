import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Result as LucideResult } from "@/lib/components/antd-lucide";
import {Modal} from 'antd';

export const openUpgradeModal = () =>
  LucideModal.info({
    icon: null,
    width: 750,
    centered: true,
    title: '',
    content: (
      <LucideResult title="Tính năng đang hoàn thiện, vui lòng quay lại sau!" />
    ),
    footer: null,
    maskClosable: true,
  });
