import express from 'express';
import { protect } from '../middleware/middleware.js';
import {
    markLessonAsCompleted,
    getLessonCompletionStatus,
    getCourseProgress,
    getUserOverallProgress,
    updateCurrentLesson,
    getCurrentLesson
} from '../controller/UserProgresscontroller.js';

const router = express.Router();

// Mark lesson as completed
router.post('/complete-lesson', protect, markLessonAsCompleted);

// Get lesson completion status
router.get('/status/:lessonId', protect, getLessonCompletionStatus);

// Get course progress
router.get('/course/:courseId', protect, getCourseProgress);

// Get user's overall progress across all courses
router.get('/overall', protect, getUserOverallProgress);

// Update current lesson (when user starts/continues a lesson)
router.put('/current-lesson', protect, updateCurrentLesson);
router.get('/current-lesson', protect, getCurrentLesson);
export default router;