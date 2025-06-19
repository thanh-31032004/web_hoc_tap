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
    completedLessons: [{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
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
    progressPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware để tự động cập nhật progressPercentage
UserProgressSchema.pre('save', async function (next) {
    if (this.isModified('completedLessons')) {
        const totalLessons = await mongoose.model('Lesson')
            .countDocuments({ course: this.course });

        this.progressPercentage = totalLessons > 0
            ? (this.completedLessons.length / totalLessons) * 100
            : 0;
    }
    next();
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
export default UserProgress;