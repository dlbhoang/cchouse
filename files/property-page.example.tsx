import React from 'react';
import PropAddEdit from '@/components/PropAddEdit';
import { Layout, Menu } from 'antd';
import { HomeOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

/**
 * Example Page using PropAddEdit Component
 * Shows how to integrate the component in a full page layout
 */
const PropertyPage: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <PlusOutlined />,
      label: 'Thêm Bất Động Sản',
    },
    {
      key: '3',
      icon: <UnorderedListOutlined />,
      label: 'Danh Sách Bất Động Sản',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          background: '#fff',
          borderRight: '1px solid #e8e8e8',
        }}
      >
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: '#fa8c16',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          {!collapsed && 'C.C.House'}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['2']}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: '#141414',
            }}
          >
            Quản Lý Bất Động Sản
          </h1>
          <div style={{ fontSize: '14px', color: '#595959' }}>
            Xin chào, Admin
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: '24px' }}>
          <PropAddEdit />
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            color: '#8c8c8c',
            borderTop: '1px solid #e8e8e8',
            marginTop: '24px',
          }}
        >
          C.C.House © 2024 · Hệ Thống Quản Lý Bất Động Sản
        </Footer>
      </Layout>
    </Layout>
  );
};

export default PropertyPage;
