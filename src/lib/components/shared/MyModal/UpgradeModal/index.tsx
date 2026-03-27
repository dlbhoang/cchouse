import { Modal, Result } from 'antd';

export const openUpgradeModal = () =>
  Modal.info({
    icon: null,
    width: 750,
    centered: true,
    title: '',
    content: (
      <Result title="Tính năng đang hoàn thiện, vui lòng quay lại sau!" />
    ),
    footer: null,
    maskClosable: true,
  });
