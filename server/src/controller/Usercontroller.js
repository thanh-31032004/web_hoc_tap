// src/controllers/userController.js
import User from '../models/user.js';

/**
 * @desc    Lấy thông tin hồ sơ người dùng
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    // req.user sẽ được gắn bởi middleware xác thực (Auth Middleware)
    try {
        const user = await User.findById(req.user._id).select('-password'); // Loại trừ password

        if (user) {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                learningPreferences: user.learningPreferences,
                skillLevel: user.skillLevel,
                learningGoals: user.learningGoals,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy hồ sơ người dùng', error: error.message });
    }
};

/**
 * @desc    Cập nhật thông tin hồ sơ người dùng
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    const { username, email, learningPreferences, skillLevel, learningGoals } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            user.learningPreferences = learningPreferences || user.learningPreferences;
            user.skillLevel = skillLevel || user.skillLevel;
            user.learningGoals = learningGoals || user.learningGoals;

            // Nếu muốn đổi mật khẩu, cần xử lý riêng hoặc thêm trường newPassword
            if (req.body.password) {
                user.password = req.body.password; // Mongoose pre-save hook sẽ hash nó
            }

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                learningPreferences: updatedUser.learningPreferences,
                skillLevel: updatedUser.skillLevel,
                learningGoals: updatedUser.learningGoals,
                token: generateToken(updatedUser._id), // Tạo lại token nếu cần cập nhật (ví dụ: vai trò)
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ người dùng', error: error.message });
    }
};