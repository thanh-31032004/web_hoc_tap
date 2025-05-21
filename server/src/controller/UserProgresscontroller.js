// src/controllers/userProgressController.js
import UserProgress from '../models/userprogress.js';
import Lesson from '../models/lesson.js';

/**
 * @desc    Đánh dấu bài học đã hoàn thành
 * @route   POST /api/progress/complete-lesson
 * @access  Private
 */
export const completeLesson = async (req, res) => {
    const { lessonId } = req.body;
    const userId = req.user._id;

    try {
        // Kiểm tra xem bài học có tồn tại không
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Bài học không tồn tại' });
        }

        // Tìm hoặc tạo mới tiến độ của người dùng cho bài học này
        const progress = await UserProgress.findOneAndUpdate(
            { user: userId, lesson: lessonId },
            { isCompleted: true, completedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true } // upsert: nếu không tìm thấy thì tạo mới
        );

        res.status(200).json({ message: 'Bài học đã được đánh dấu hoàn thành', progress });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật tiến độ bài học', error: error.message });
    }
};

/**
 * @desc    Lấy tiến độ học tập của người dùng
 * @route   GET /api/progress/:userId (hoặc /api/progress/my)
 * @access  Private
 */
export const getUserProgress = async (req, res) => {
    const userId = req.user._id; // Lấy từ token người dùng

    try {
        const progress = await UserProgress.find({ user: userId })
            .populate('lesson', 'title course module'); // Lấy thông tin bài học
        res.status(200).json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy tiến độ người dùng', error: error.message });
    }
};