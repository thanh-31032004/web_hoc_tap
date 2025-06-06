// src/routes/courseRoutes.js
import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse, // Chỉ dành cho admin/instructor
    updateCourse,
    deleteCourse
} from '../controller/Coursecontroller';
import { protect, authorizeRoles } from '../middleware/middleware';

const courseRoute = express.Router();

// Public routes: Ai cũng có thể xem khóa học
courseRoute.get('/', getCourses);
courseRoute.get('/:id', getCourseById);

// Protected routes: Chỉ admin/instructor mới có thể tạo khóa học
courseRoute.post('/', createCourse);

// Bạn có thể thêm các route cho việc cập nhật, xóa khóa học, module, bài học ở đây
courseRoute.put('/:id', updateCourse);
courseRoute.delete('/:id', deleteCourse);

export default courseRoute;