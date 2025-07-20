// src/models/Lesson.js
import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Tên bài học là bắt buộc'], trim: true },
    description: { type: String, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    contentType: { type: String, enum: ['video', 'text'], required: true },
    contentUrl: {
        type: String,
        required: function () { return this.contentType !== 'text'; }
    },
    contentText: {
        type: String,
        required: function () { return this.contentType === 'text'; }
    },
    order: { type: Number, required: true },
    duration: { type: Number, default: 0, min: 1 },
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', LessonSchema);
export default Lesson;
