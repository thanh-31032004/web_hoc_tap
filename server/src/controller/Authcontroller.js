// src/controllers/authController.js
import User from '../models/user'   // Đảm bảo đúng đường dẫn tới model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Hàm tạo JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token hết hạn sau 1 ngày
    });
};

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Kiểm tra xem người dùng đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được đăng ký' });
        }

        // 2. Tạo người dùng mới (password sẽ được hash bởi pre-save hook trong User Model)
        const user = await User.create({
            username,
            email,
            password,
        });

        // 3. Gửi phản hồi thành công với token
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        // Xử lý lỗi validation hoặc lỗi server
        res.status(500).json({ message: 'Đăng ký thất bại', error: error.message });
    }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm người dùng bằng email (sử dụng .select('+password') để lấy trường password)
        const user = await User.findOne({ email }).select('+password');

        // 2. Kiểm tra nếu không tìm thấy người dùng hoặc mật khẩu không khớp
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }

        // 3. Gửi phản hồi thành công với token
        res.status(200).json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đăng nhập thất bại', error: error.message });
    }
};
// src/controller/Authcontroller.js


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            message: 'Cập nhật vai trò thành công',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
