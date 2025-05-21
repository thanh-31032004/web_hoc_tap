// src/models/Roadmap.js
import mongoose from 'mongoose';

const RoadmapSchema = new mongoose.Schema({
    user: { // Lộ trình thuộc về người dùng nào
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Mỗi người dùng chỉ có một lộ trình chính được gợi ý (hoặc có thể có nhiều bản nháp)
    },
    name: { // Tên của lộ trình (ví dụ: "Lộ trình Fullstack Web Developer")
        type: String,
        default: 'Lộ trình học tập của tôi'
    },
    // Các tiêu chí mà lộ trình này được tạo ra dựa trên
    preferencesUsed: {
        type: [String], // Ví dụ: ['frontend', 'javascript']
        default: []
    },
    skillLevelUsed: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    goalUsed: {
        type: String,
        default: ''
    },
    // Các bước trong lộ trình (mảng các Course hoặc Module ID)
    // Có thể là một mảng hỗn hợp ID các Course hoặc Module, hoặc một cấu trúc phức tạp hơn
    // Ở đây đơn giản là một mảng các Course ID được gợi ý
    recommendedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    status: { // Trạng thái của lộ trình: active, completed, draft
        type: String,
        enum: ['active', 'completed', 'draft'],
        default: 'active'
    },
    lastSuggestedAt: { // Thời gian AI gợi ý lần cuối
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Roadmap = mongoose.model('Roadmap', RoadmapSchema);
export default Roadmap;