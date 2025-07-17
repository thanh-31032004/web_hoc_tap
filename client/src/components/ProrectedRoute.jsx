// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ children, authorize = [] }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const isAuthenticated = !!token && !!user;
    const userRole = user?.role; // Lấy vai trò của người dùng

    // 1. Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu có yêu cầu phân quyền và vai trò của người dùng không khớp
    if (authorize.length > 0 && !authorize.includes(userRole)) {
        // Nếu không có quyền, chuyển hướng về trang chủ hoặc trang 403 Forbidden
        return <Navigate to="/403" replace />; // Hoặc bạn có thể tạo trang 403
    }

    // Nếu đã đăng nhập và có quyền, render children (hoặc Outlet nếu dùng nested routes)
    return children ? children : <Outlet />;
};

export default ProtectedRoute;