// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Đây là component để kiểm tra xem người dùng đã đăng nhập chưa
// Nếu chưa, chuyển hướng về trang đăng nhập
const ProtectedRoute = ({ children }) => {
    // Logic kiểm tra token từ localStorage hoặc state quản lý người dùng
    const token = localStorage.getItem('token'); // Hoặc lấy từ Redux/Context state
    const isAuthenticated = !!token; // Đơn giản là kiểm tra sự tồn tại của token

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;