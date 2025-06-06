// client/src/components/layout/AdminLayout.jsx
import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Outlet để render nested routes
import AdminSidebar from '../components/Sidebar'; // <-- Import AdminSidebar

const drawerWidth = 240; // Đảm bảo chiều rộng khớp với AdminSidebar

function AdminLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    zIndex: (theme) => theme.zIndex.drawer + 1, // Đảm bảo AppBar nằm trên Sidebar
                    bgcolor: '#1976d2' // Màu xanh Material Design cho AppBar
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                    {/* Tùy chọn: Thêm các nút khác ở đây, ví dụ nút quay về trang người dùng */}
                </Toolbar>
            </AppBar>

            <AdminSidebar /> {/* <-- Sử dụng AdminSidebar component ở đây */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8 // Khoảng cách từ trên xuống để tránh bị AppBar che
                }}
            >
                <Toolbar /> {/* Nơi này không cần thiết nếu dùng mt: 8 ở Box main, nhưng thường được dùng để tạo khoảng trống bằng chiều cao của AppBar */}
                <Outlet /> {/* Nơi các nested routes (ví dụ: AdminCourseListPage) sẽ được render */}
            </Box>
        </Box>
    );
}

export default AdminLayout;