import { VideoCameraOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';

import { NotiBase } from '../../NotiBase';

export const openVideoModal = (isMobile: boolean, videoUrl?: string) =>
  videoUrl
    ? Modal.info({
        icon: <VideoCameraOutlined />,
        width: 750,
        centered: true,
        title: 'Video',
        content: (
          <ReactPlayer
            width={isMobile ? 350 : undefined}
            url={videoUrl}
            controls
          />
        ),
        footer: null,
        maskClosable: true,
      })
    : NotiBase('error', 'Không tìm thấy video');
