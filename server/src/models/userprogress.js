import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // THÊM: Theo dõi trạng thái từng bài học
    lessonStatus: [{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true
        },
        status: {
            type: String,
            enum: ['chưa hoàn thành', 'đang học', 'hoàn thành'],
            default: 'chưa hoàn thành'
        },
        // THÊM: Ngày hoàn thành (nếu có)
        completedAt: Date
    }],
    // GIỮ: Bài học cuối truy cập
    lastAccessedLesson: {
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        },
        accessedAt: {
            type: Date,
            default: Date.now
        }
    },
    // GIỮ: Phần trăm hoàn thành
    progressPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// THÊM: Index cho truy vấn nhanh
UserProgressSchema.index({ user: 1, course: 1 });

// CẢI THIỆN: Middleware tối ưu hơn
UserProgressSchema.pre('save', async function (next) {
    if (this.isModified('lessonStatus')) {
        // Chỉ đếm bài học đã hoàn thành
        const completedCount = this.lessonStatus.filter(
            ls => ls.status === 'hoàn thành'
        ).length;

        // Lấy tổng số bài học (cache nếu cần)
        if (!this.totalLessons) {
            this.totalLessons = await mongoose.model('Lesson')
                .countDocuments({ course: this.course });
        }

        this.progressPercentage = this.totalLessons > 0
            ? Math.round((completedCount / this.totalLessons) * 100)
            : 0;
    }
    next();
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
export default UserProgress;