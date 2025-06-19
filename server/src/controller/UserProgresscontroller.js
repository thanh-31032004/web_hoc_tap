import UserProgress from '../models/userprogress.js';
import Lesson from '../models/lesson.js';
import { asyncHandler } from '../middleware/asyncHaandler.js';

export const markLessonAsCompleted = asyncHandler(async (req, res) => {
    const { lessonId } = req.body;
    const userId = req.user._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        res.status(404);
        throw new Error('Không tìm thấy bài học');
    }

    let progress = await UserProgress.findOne({
        user: userId,
        course: lesson.course
    });

    if (!progress) {
        progress = new UserProgress({
            user: userId,
            course: lesson.course,
            completedLessons: [],
            lastAccessedLesson: {
                lesson: lessonId,
                accessedAt: new Date()
            }
        });
    }

    // Kiểm tra xem bài học đã hoàn thành chưa
    const isLessonCompleted = progress.completedLessons
        .some(item => item.lesson.toString() === lessonId);

    if (!isLessonCompleted) {
        progress.completedLessons.push({
            lesson: lessonId,
            completedAt: new Date()
        });
    }

    // Cập nhật bài học cuối cùng được truy cập
    progress.lastAccessedLesson = {
        lesson: lessonId,
        accessedAt: new Date()
    };

    await progress.save();

    // Populate thông tin chi tiết để trả về
    await progress.populate('completedLessons.lesson', 'title');
    await progress.populate('lastAccessedLesson.lesson', 'title');

    res.json({
        success: true,
        progress: {
            courseId: progress.course,
            completedLessons: progress.completedLessons,
            lastAccessedLesson: progress.lastAccessedLesson,
            progressPercentage: progress.progressPercentage
        }
    });
});

export const getLessonCompletionStatus = asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        res.status(404);
        throw new Error('Không tìm thấy bài học');
    }

    const progress = await UserProgress.findOne({
        user: userId,
        course: lesson.course
    });

    const isCompleted = progress?.completedLessons
        .some(item => item.lesson.toString() === lessonId) || false;

    res.json({ isCompleted });
});

export const getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await UserProgress.findOne({
        user: userId,
        course: courseId
    })
        .populate('completedLessons.lesson', 'title')
        .populate('lastAccessedLesson.lesson', 'title');

    if (!progress) {
        return res.json({
            completedLessons: [],
            progressPercentage: 0,
            lastAccessedLesson: null
        });
    }

    res.json({
        completedLessons: progress.completedLessons,
        progressPercentage: progress.progressPercentage,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});

export const getUserOverallProgress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const allProgress = await UserProgress.find({ user: userId })
        .populate('course', 'title')
        .populate('completedLessons.lesson', 'title')
        .populate('lastAccessedLesson.lesson', 'title');

    const progressByCourse = allProgress.reduce((acc, progress) => {
        acc[progress.course._id] = {
            courseTitle: progress.course.title,
            completedLessons: progress.completedLessons,
            progressPercentage: progress.progressPercentage,
            lastAccessedLesson: progress.lastAccessedLesson
        };
        return acc;
    }, {});

    res.json(progressByCourse);
});
// ...existing code...

export const updateCurrentLesson = asyncHandler(async (req, res) => {
    const { lessonId, courseId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!lessonId || !courseId) {
        res.status(400);
        throw new Error('Thiếu ID bài học hoặc khóa học');
    }

    // Find or create progress document
    let progress = await UserProgress.findOne({
        user: userId,
        course: courseId
    });

    if (!progress) {
        progress = new UserProgress({
            user: userId,
            course: courseId,
            completedLessons: [],
        });
    }

    // Update last accessed lesson
    progress.lastAccessedLesson = {
        lesson: lessonId,
        accessedAt: new Date()
    };

    await progress.save();

    // Populate lesson details before sending response
    await progress.populate('lastAccessedLesson.lesson', 'title');

    res.json({
        success: true,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});

export const getCurrentLesson = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const progress = await UserProgress.findOne({ user: userId })
        .sort({ 'lastAccessedLesson.accessedAt': -1 }) // phòng trường hợp có nhiều progress
        .populate('lastAccessedLesson.lesson', 'title course');

    if (!progress || !progress.lastAccessedLesson) {
        return res.status(404).json({ message: 'Chưa có bài học nào được lưu.' });
    }

    res.json({
        success: true,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});