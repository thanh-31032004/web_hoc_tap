// client/src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { Typography, Container, Box } from '@mui/material';

function AdminDashboardPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Chào mừng đến với Bảng điều khiển Admin
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                    Đây là nơi bạn có thể quản lý các khóa học, module, bài học và người dùng của ứng dụng.
                </Typography>
                {/* Thêm các widget hoặc thống kê nhanh tại đây */}
            </Box>
        </Container>
    );
}

export default AdminDashboardPage;