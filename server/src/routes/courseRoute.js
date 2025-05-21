// src/routes/courseRoutes.js
import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse // Chỉ dành cho admin/instructor
} from '../controller/Coursecontroller';
import { protect, authorizeRoles } from '../middleware/middleware';

const courseRoute = express.Router();

// Public routes: Ai cũng có thể xem khóa học
courseRoute.get('/', getCourses);
courseRoute.get('/:id', getCourseById);

// Protected routes: Chỉ admin/instructor mới có thể tạo khóa học
courseRoute.post('/', protect, authorizeRoles('admin', 'instructor'), createCourse);

// Bạn có thể thêm các route cho việc cập nhật, xóa khóa học, module, bài học ở đây
// courseRoute.put('/:id', protect, authorizeRoles('admin', 'instructor'), updateCourse);
// courseRoute.delete('/:id', protect, authorizeRoles('admin', 'instructor'), deleteCourse);

export default courseRoute;