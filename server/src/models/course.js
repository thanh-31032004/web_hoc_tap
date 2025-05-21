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
        default: '/images/default_course_thumbnail.jpg'
    },
    category: {
        type: String,
        enum: ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'DevOps', 'Cybersecurity', 'Game Development', 'Others'],
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