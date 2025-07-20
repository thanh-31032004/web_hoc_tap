// client/src/components/layout/AdminSidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    ReadOutlined,
    BookOutlined,
    UsergroupAddOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin'),
        },
        {
            key: '/admin/courses',
            icon: <ReadOutlined />,
            label: 'Quản lý Khóa học',
            onClick: () => navigate('/admin/courses'),
        },
        {
            key: '/admin/lessons',
            icon: <BookOutlined />,
            label: 'Quản lý Bài học',
            onClick: () => navigate('/admin/lessons'),
        },
        {
            key: '/admin/users',
            icon: <UsergroupAddOutlined />,
            label: 'Quản lý Người dùng',
            onClick: () => navigate('/admin/users'),
        },
    ];

    const bottomItems = [
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Trang cá nhân',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    return (
        <Sider
            width={240}
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
                background: '#001529',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 600 }}>
                Admin
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ flex: 1 }}
            />

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[]}
                items={bottomItems}
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
        </Sider>
    );
};

export default AdminSidebar;
