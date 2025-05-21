// src/models/Module.js
import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên module là bắt buộc'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    course: { // Module thuộc về khóa học nào
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: { // Thứ tự của module trong khóa học
        type: Number,
        required: true
    },
    lessons: [{ // Mảng các ID của bài học thuộc module này
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson' // Tham chiếu đến Lesson Model
    }]
}, {
    timestamps: true
});

const Module = mongoose.model('Module', ModuleSchema);
export default Module;