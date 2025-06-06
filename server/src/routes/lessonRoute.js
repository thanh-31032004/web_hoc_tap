// src/routes/lessonRoutes.js
import { Router } from 'express';
import {
    createLesson,
    getLessonsByCourse,
    getLessonById,
    updateLesson,
    deleteLesson,
    getAllLessons,
} from '../controller/Lessioncontroller.js'; // Đảm bảo đường dẫn đúng

// import { protect, authorize } from '../middleware/authMiddleware.js'; // Nếu bạn đã có middleware xác thực

const lessonRouter = Router();

// Routes yêu cầu xác thực (ví dụ: chỉ admin/giáo viên mới có thể tạo/sửa/xóa)
// Bạn có thể bỏ comment dòng protect và authorize nếu đã có middleware
// lessonRouter.post('/', protect, authorize(['admin', 'teacher']), createLesson);
// lessonRouter.put('/:id', protect, authorize(['admin', 'teacher']), updateLesson);
// lessonRouter.delete('/:id', protect, authorize(['admin', 'teacher']), deleteLesson);

// Routes công khai (mọi người đều có thể xem)
lessonRouter.get('/course/:courseId', getLessonsByCourse); // Lấy bài học theo Course ID
lessonRouter.get('/:id', getLessonById); // Lấy bài học theo Lesson ID
lessonRouter.get('/', getAllLessons)
// Nếu bạn chưa có middleware xác thực, có thể tạm thời để public để test:
lessonRouter.post('/', createLesson);
lessonRouter.put('/:id', updateLesson);
lessonRouter.delete('/:id', deleteLesson);


export default lessonRouter;