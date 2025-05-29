// src/routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controller/Usercontroller.js';
import { protect } from '../middleware/middleware.js'; // Import middleware bảo vệ

const userRoute = express.Router();

// Áp dụng middleware `protect` cho các route yêu cầu xác thực
userRoute.route('/profile')
    .get(protect, getUserProfile)      // Lấy hồ sơ người dùng
    .put(protect, updateUserProfile);  // Cập nhật hồ sơ người dùng

// Bạn có thể thêm các route admin để lấy/quản lý tất cả người dùng ở đây (ví dụ: userRoute.get('/', protect, authorizeRoles('admin'), getAllUsers);)

export default userRoute;