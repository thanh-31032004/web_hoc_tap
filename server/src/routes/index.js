// src/routes/index.js (File chính)
import { Router } from 'express';
import userRoute from './userRoute';
import courseRoute from './courseRoute';
import authRouter from './authRoute';
import lessonRouter from './lessonRoute';
// import aiRoute from './aiRoute';
import userProgressRoute from './userProgressroute';

const router = Router();

// // Định nghĩa các đường dẫn cơ sở cho từng nhóm API
router.use('/auth', authRouter);         // Tất cả các route trong authRoutes sẽ có tiền tố /api/auth
router.use('/users', userRoute);        // /api/users
router.use('/courses', courseRoute);    // /api/courses
router.use('/progress', userProgressRoute); // /api/progress
// router.use('/ai', aiRoute);             // /api/ai
router.use('/lessons', lessonRouter);
// Bạn có thể thêm một route mặc định nếu muốn
router.get('/', (req, res) => {
  res.send('API is running...');
});

export default router;