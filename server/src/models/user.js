// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Thư viện để mã hóa mật khẩu

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Tên người dùng là bắt buộc'],
        unique: true,
        trim: true,   
        minlength: [3, 'Tên người dùng phải có ít nhất 3 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true, 
        trim: true,
        match: [/.+@.+\..+/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false // 
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'], 
        default: 'student'
    },
    learningPreferences: {
        type:['frontend', 'backend', 'mobile'],
        default: []
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    learningGoals: {
        type: String, // Ví dụ: 'Become a fullstack developer', 'Get a job'
        default: ''
    },
}, {
    timestamps: true 
});

// Middleware Mongoose: Mã hóa mật khẩu trước khi lưu (hash password before saving)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // Chỉ hash nếu password bị thay đổi hoặc là mới
        return next();
    }
    const salt = await bcrypt.genSalt(10); // Tạo salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
});

// Phương thức để so sánh mật khẩu (so sánh mật khẩu nhập vào với mật khẩu đã hash trong DB)
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;