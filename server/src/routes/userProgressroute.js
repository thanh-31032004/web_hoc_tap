import express from 'express';
import { protect } from '../middleware/middleware.js';
import {
    markLessonAsCompleted,
    getLessonCompletionStatus,
    getCourseProgress,
    getUserOverallProgress,
    updateCurrentLesson,
    getCurrentLesson,
    getAllProgress
} from '../controller/UserProgresscontroller.js';

const router = express.Router();

// Nhóm các route liên quan đến bài học cụ thể
router.route('/lessons/:lessonId/status')
    .get(protect, getLessonCompletionStatus);

router.route('/lessons/complete')
    .post(protect, markLessonAsCompleted);

// Nhóm các route liên quan đến khóa học
router.route('/courses/:courseId')
    .get(protect, getCourseProgress);

// Route tổng thể
router.route('/overview')
    .get(protect, getUserOverallProgress);

// Route bài học hiện tại
router.route('/current-lesson')
    .get(protect, getCurrentLesson)
    .put(protect, updateCurrentLesson);
router.get('/all', protect, getAllProgress);

export default router;