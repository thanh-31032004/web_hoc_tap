import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Layout,
    Menu,
    Button,
    Avatar,
    Dropdown,
    Typography,
    Space,
    Tooltip,
} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    RobotOutlined,
} from '@ant-design/icons';
import { logout } from '../features/auth/authSlide';

const { Header: AntHeader } = Layout;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClick = ({ key }) => {
        setMenuOpen(false);
        if (key === 'profile') {
            navigate('/profile');
        } else if (key === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch(logout());
            navigate('/login');
            window.location.reload();
        }
    };

    const menuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Thông tin cá nhân',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
        },
    ];

    const renderAvatar = () => {
        if (user?.avatar) {
            return <Avatar src={user.avatar} />;
        }
        const initial = user?.username?.[0]?.toUpperCase() || '?';
        return <Avatar>{initial}</Avatar>;
    };

    return (
        <AntHeader
            style={{
                backgroundColor: '#2196f3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
            }}
        >
            <Space size="large">
                <Link to="/" style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                    <RobotOutlined style={{ marginRight: 8 }} />
                    Học Cùng AI
                </Link>

                <Link to="/ai-roadmap" style={{ color: 'white', fontSize: 16 }}>
                    Lộ trình AI
                </Link>
            </Space>

            <Space size="middle">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">
                            <Button ghost>Đăng nhập</Button>
                        </Link>
                        <Link to="/register">
                            <Button ghost>Đăng ký</Button>
                        </Link>
                    </>
                ) : (
                    <Dropdown
                        menu={{ items: menuItems, onClick: handleMenuClick }}
                        placement="bottomRight"
                        trigger={['click']}
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                    >
                        <Tooltip title={user?.username}>
                            <Avatar
                                style={{ cursor: 'pointer', backgroundColor: '#fff', color: '#1890ff' }}
                                icon={<UserOutlined />}
                                src={user?.avatar}
                            />
                        </Tooltip>
                    </Dropdown>
                )}
            </Space>
        </AntHeader>
    );
};

export default Header;
