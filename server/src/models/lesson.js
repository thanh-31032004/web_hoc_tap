// src/models/Lesson.js
import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên bài học là bắt buộc'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    module: { // Bài học thuộc về module nào
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    course: { // Tham chiếu trực tiếp đến Course để dễ query
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    contentType: { // Loại nội dung: video, text, quiz, code_editor
        type: String,
        enum: ['video', 'text', 'quiz', 'code_editor'],
        required: true
    },
    contentUrl: { // Đường dẫn tới video, hoặc file markdown/HTML, hoặc ID quiz
        type: String,
        required: function() { return this.contentType !== 'text'; } // Bắt buộc nếu không phải text
    },
    contentText: { // Nội dung văn bản trực tiếp (nếu contentType là 'text')
        type: String,
        required: function() { return this.contentType === 'text'; } // Bắt buộc nếu là text
    },
    order: { // Thứ tự bài học trong module
        type: Number,
        required: true
    },
    duration: { // Thời lượng của bài học (ví dụ: phút cho video)
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', LessonSchema);
export default Lesson;