import UserProgress from '../models/userprogress.js';
import Lesson from '../models/lesson.js';
import { asyncHandler } from '../middleware/asyncHaandler.js';

export const markLessonAsCompleted = asyncHandler(async (req, res) => {
    const { lessonId } = req.body;
    const userId = req.user.id;

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
            lessonStatus: [{
                lesson: lessonId,
                status: 'hoàn thành',
                completedAt: new Date()
            }],
            lastAccessedLesson: {
                lesson: lessonId,
                accessedAt: new Date()
            }
        });
    } else {
        // Tìm và cập nhật trạng thái bài học
        const lessonIndex = progress.lessonStatus.findIndex(
            ls => ls.lesson.toString() === lessonId
        );

        if (lessonIndex === -1) {
            // Thêm bài học mới vào lessonStatus
            progress.lessonStatus.push({
                lesson: lessonId,
                status: 'hoàn thành',
                completedAt: new Date()
            });
        } else {
            // Cập nhật trạng thái bài học hiện tại
            progress.lessonStatus[lessonIndex].status = 'hoàn thành';
            progress.lessonStatus[lessonIndex].completedAt = new Date();
        }

        // Cập nhật bài học cuối cùng được truy cập
        progress.lastAccessedLesson = {
            lesson: lessonId,
            accessedAt: new Date()
        };
    }

    await progress.save();

    // Populate thông tin chi tiết
    await progress.populate('lessonStatus.lesson', 'title');
    await progress.populate('lastAccessedLesson.lesson', 'title');

    // Lọc ra các bài học đã hoàn thành
    const completedLessons = progress.lessonStatus
        .filter(ls => ls.status === 'hoàn thành')
        .map(ls => ({
            lesson: ls.lesson,
            completedAt: ls.completedAt
        }));

    res.json({
        success: true,
        progress: {
            courseId: progress.course,
            completedLessons,
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

    let isCompleted = false;
    if (progress) {
        const lessonStatus = progress.lessonStatus.find(
            ls => ls.lesson.toString() === lessonId
        );
        isCompleted = lessonStatus?.status === 'hoàn thành';
    }

    res.json({ isCompleted });
});

export const getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await UserProgress.findOne({
        user: userId,
        course: courseId
    })
        .populate('lessonStatus.lesson', 'title')
        .populate('lastAccessedLesson.lesson', 'title');

    if (!progress) {
        return res.json({
            completedLessons: [],
            progressPercentage: 0,
            lastAccessedLesson: null
        });
    }

    // Lọc ra các bài học đã hoàn thành
    const completedLessons = progress.lessonStatus
        .filter(ls => ls.status === 'hoàn thành')
        .map(ls => ({
            lesson: ls.lesson,
            completedAt: ls.completedAt
        }));

    res.json({
        completedLessons,
        progressPercentage: progress.progressPercentage,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});

export const getUserOverallProgress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const allProgress = await UserProgress.find({ user: userId })
        .populate('course', 'title')
        .populate('lessonStatus.lesson', 'title')
        .populate('lastAccessedLesson.lesson', 'title');

    const progressByCourse = allProgress.reduce((acc, progress) => {
        // Lọc ra các bài học đã hoàn thành
        const completedLessons = progress.lessonStatus
            .filter(ls => ls.status === 'hoàn thành')
            .map(ls => ({
                lesson: ls.lesson,
                completedAt: ls.completedAt
            }));

        acc[progress.course._id] = {
            courseTitle: progress.course.title,
            completedLessons,
            progressPercentage: progress.progressPercentage,
            lastAccessedLesson: progress.lastAccessedLesson
        };
        return acc;
    }, {});

    res.json(progressByCourse);
});

export const updateCurrentLesson = asyncHandler(async (req, res) => {
    const { lessonId, courseId } = req.body;
    const userId = req.user._id;

    if (!lessonId || !courseId) {
        res.status(400);
        throw new Error('Thiếu ID bài học hoặc khóa học');
    }

    let progress = await UserProgress.findOne({
        user: userId,
        course: courseId
    });

    if (!progress) {
        progress = new UserProgress({
            user: userId,
            course: courseId,
            lessonStatus: [{
                lesson: lessonId,
                status: 'đang học'
            }]
        });
    } else {
        // Cập nhật hoặc thêm trạng thái bài học
        const lessonIndex = progress.lessonStatus.findIndex(
            ls => ls.lesson.toString() === lessonId
        );

        if (lessonIndex === -1) {
            progress.lessonStatus.push({
                lesson: lessonId,
                status: 'đang học'
            });
        } else if (progress.lessonStatus[lessonIndex].status !== 'hoàn thành') {
            // Chỉ cập nhật nếu chưa hoàn thành
            progress.lessonStatus[lessonIndex].status = 'đang học';
        }
    }

    // Cập nhật bài học cuối cùng truy cập
    progress.lastAccessedLesson = {
        lesson: lessonId,
        accessedAt: new Date()
    };

    await progress.save();
    await progress.populate('lastAccessedLesson.lesson', 'title');

    res.json({
        success: true,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});

export const getCurrentLesson = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const progress = await UserProgress.findOne({ user: userId })
        .sort({ 'lastAccessedLesson.accessedAt': -1 })
        .populate('lastAccessedLesson.lesson', 'title course');

    if (!progress || !progress.lastAccessedLesson) {
        return res.status(404).json({ message: 'Chưa có bài học nào được lưu.' });
    }

    res.json({
        success: true,
        lastAccessedLesson: progress.lastAccessedLesson
    });
});

export const getAllProgress = async (req, res) => {
    try {
        // Tìm tất cả progress của user
        const progressList = await UserProgress.find({ user: req.user._id })
            .populate({
                path: "lastAccessedLesson.lesson",
                model: "Lesson",
                select: "_id title order"
            })
            .populate({
                path: "lessonStatus.lesson",
                model: "Lesson",
                select: "_id title order"
            })
            .lean();

        // Trả về mảng kết quả
        const result = await Promise.all(
            progressList.map(async (progress) => {
                const totalLessons = await Lesson.countDocuments({
                    course: progress.course,
                });

                // ✅ Lấy ra danh sách bài học đã hoàn thành
                const completedLessons = progress.lessonStatus
                    .filter(item => item.status === "hoàn thành")
                    .map(item => item.lesson);

                const completedCount = completedLessons.length;

                const percentage =
                    totalLessons > 0
                        ? Math.round((completedCount / totalLessons) * 100)
                        : 0;

                return {
                    courseId: progress.course,
                    completedLessons,
                    progressPercentage: percentage,
                    lastAccessedLesson: progress.lastAccessedLesson,
                    totalLessons,
                };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server khi lấy progress cho tất cả khóa học",
            error: error.message,
        });
    }
};

