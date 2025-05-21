// src/routes/userProgressRoutes.js
import express from 'express';
import { completeLesson, getUserProgress } from '../controller/UserProgresscontroller';
import { protect } from '../middleware/middleware';

const userProgressRoute = express.Router();

// Các route yêu cầu người dùng đã đăng nhập
userProgressRoute.post('/complete-lesson', protect, completeLesson); // Đánh dấu bài học đã hoàn thành
userProgressRoute.get('/my', protect, getUserProgress);             // Lấy tiến độ của người dùng hiện tại

export default userProgressRoute;