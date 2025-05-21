// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Đảm bảo đường dẫn đúng tới User model

const protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra xem token có trong header Authorization không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (ví dụ: "Bearer YOUR_TOKEN_HERE")
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm người dùng trong DB dựa trên ID từ token và loại trừ password
            req.user = await User.findById(decoded.id).select('-password');

            // Chuyển sang middleware/controller tiếp theo
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không được phép, token thất bại hoặc không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không tìm thấy token' });
    }
};

// Middleware kiểm tra vai trò (tùy chọn, nếu bạn cần phân quyền)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Không được phép truy cập. Chỉ ${roles.join(', ')} mới có quyền.` });
        }
        next();
    };
};

export { protect, authorizeRoles };