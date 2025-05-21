// src/models/UserProgress.js
import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lesson: { // Bài học mà người dùng đang theo dõi tiến độ
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    isCompleted: { // Đã hoàn thành bài học này chưa
        type: Boolean,
        default: false
    },
    completedAt: { // Thời gian hoàn thành
        type: Date,
        default: null // Null nếu chưa hoàn thành
    },
    // Có thể thêm: progressPercentage (ví dụ: 0.5 cho 50% video), quizScore
    quizScore: {
        type: Number,
        default: 0 // Điểm số bài quiz nếu có
    }
}, {
    timestamps: true
});

// Đảm bảo mỗi người dùng chỉ có một bản ghi tiến độ cho mỗi bài học
UserProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
export default UserProgress;