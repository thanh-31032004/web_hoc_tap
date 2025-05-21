// src/controllers/aiController.js
import User from '../models/user.js';
import Course from '../models/course.js';
import Roadmap from '../models/roadmap.js';

/**
 * @desc    Gợi ý lộ trình học tập dựa trên thông tin người dùng
 * @route   POST /api/ai/suggest-roadmap
 * @access  Private
 */
export const suggestRoadmap = async (req, res) => {
    const userId = req.user._id;
    const { learningPreferences, skillLevel, learningGoals } = req.body; // Hoặc lấy từ hồ sơ người dùng

    try {
        // Cập nhật thông tin AI Preferences của người dùng nếu gửi lên
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        user.learningPreferences = learningPreferences || user.learningPreferences;
        user.skillLevel = skillLevel || user.skillLevel;
        user.learningGoals = learningGoals || user.learningGoals;
        await user.save();

        let recommendedCourseIds = [];

        // --- Logic gợi ý lộ trình đơn giản (Rule-based) ---
        // Bạn sẽ phát triển phần này sau, có thể là các thuật toán ML phức tạp hơn
        if (learningGoals.includes('web development') && skillLevel === 'beginner') {
            // Tìm các khóa học cơ bản về web development
            const webBasics = await Course.find({
                category: 'Web Development',
                difficulty: 'Beginner'
            }).limit(3);
            recommendedCourseIds = webBasics.map(course => course._id);
        } else if (learningGoals.includes('data science') && skillLevel === 'intermediate') {
            const dataScienceCourses = await Course.find({
                category: 'Data Science',
                difficulty: 'Intermediate'
            }).limit(3);
            recommendedCourseIds = dataScienceCourses.map(course => course._id);
        }
        // Thêm các điều kiện khác tùy theo yêu cầu của bạn

        // Lưu hoặc cập nhật lộ trình gợi ý vào DB
        const roadmap = await Roadmap.findOneAndUpdate(
            { user: userId },
            {
                name: `Lộ trình cho ${learningGoals}`,
                preferencesUsed: learningPreferences,
                skillLevelUsed: skillLevel,
                goalUsed: learningGoals,
                recommendedCourses: recommendedCourseIds,
                lastSuggestedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).populate('recommendedCourses', 'title description thumbnail'); // Populate để lấy thông tin khóa học

        res.status(200).json({
            message: 'Lộ trình đã được gợi ý thành công!',
            roadmap
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi gợi ý lộ trình', error: error.message });
    }
};


/**
 * @desc    Lấy lộ trình đã gợi ý cho người dùng
 * @route   GET /api/ai/my-roadmap
 * @access  Private
 */
export const getMyRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ user: req.user._id })
            .populate('recommendedCourses', 'title description thumbnail category difficulty'); // Populate để lấy thông tin khóa học

        if (!roadmap) {
            return res.status(404).json({ message: 'Bạn chưa có lộ trình nào được gợi ý.' });
        }

        res.status(200).json(roadmap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy lộ trình của bạn', error: error.message });
    }
};