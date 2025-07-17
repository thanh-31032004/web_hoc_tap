// src/routes/index.js (File chính)
import { Router } from 'express';
import userRoute from './userRoute';
import courseRoute from './courseRoute';
import authRouter from './authRoute';
import lessonRouter from './lessonRoute';
import userProgressRoute from './userProgressroute';
import totalrouter from './totalRoute';

const router = Router();

// // Định nghĩa các đường dẫn cơ sở cho từng nhóm API
router.use('/auth', authRouter);         // Tất cả các route trong authRoutes sẽ có tiền tố /api/auth
router.use('/users', userRoute);        // /api/users
router.use('/courses', courseRoute);    // /api/courses
router.use('/progress', userProgressRoute); // /api/progress
router.use('/lessons', lessonRouter);
router.use('/admin', totalrouter); // /api/admin
router.get('/', (req, res) => {
  res.send('API is running...');
});

export default router;