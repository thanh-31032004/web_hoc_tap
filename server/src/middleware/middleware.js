// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }

            return next(); // ✅ Kết thúc thành công
        } catch (error) {
            console.error('Lỗi xác thực:', error.message);
            return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
        }
    }

    // ✅ Chỉ chạy khi KHÔNG có token
    return res.status(401).json({ message: 'Không được phép, không tìm thấy token' });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // ✅ Kết thúc thành công
    }
    return res.status(403).json({ message: 'Không có quyền truy cập' }); // ✅ Không phải admin
};
export { protect, isAdmin };
