// client/src/components/layout/Layout.jsx
import React from 'react';
import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer
import { Box, CssBaseline } from '@mui/material'; // CssBaseline để reset CSS cơ bản
import { Outlet } from 'react-router-dom';

// Component Layout chính bao bọc toàn bộ ứng dụng
const Layout = () => {
    return (
        // Box là một component linh hoạt của MUI, dùng để tạo bố cục
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Đảm bảo layout chiếm toàn bộ chiều cao màn hình
        }}>
            <CssBaseline /> {/* Reset CSS của trình duyệt */}
            <Header /> {/* Thanh điều hướng trên cùng */}

            {/* Vùng nội dung chính, flexGrow: 1 để chiếm không gian còn lại */}
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}> {/* Padding top/bottom cho nội dung */}
                <Outlet />
            </Box>

            <Footer /> {/* Footer ở cuối trang */}
        </Box>
    );
};

export default Layout;