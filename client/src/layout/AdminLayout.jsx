import React from 'react';
import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar'; // Sidebar mới dùng antd
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar bên trái */}
            <Sider
                width={240}
                style={{
                    background: '#001529',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflow: 'auto',
                }}
            >
                <AdminSidebar />
            </Sider>

            {/* Phần còn lại: Header + Content */}
            <Layout style={{ marginLeft: 240 }}>
                <ToastContainer position="top-right" autoClose={3000} />

                <Header
                    style={{
                        background: '#1677ff',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        height: 64,
                    }}
                >
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#f5f5f5',
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
