// src/models/Course.js
import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên khóa học là bắt buộc'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Mô tả khóa học là bắt buộc']
    },
    thumbnail: { // Đường dẫn tới ảnh đại diện của khóa học
        type: String,
        required: [true, 'Ảnh đại diện là bắt buộc'],
    },
    category: {
        type: String,
        enum: ['Web Development', 'Mobile Development', 'Data Science', 'Game Development'],
        required: [true, 'Danh mục là bắt buộc']
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
}, {
    timestamps: true
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;