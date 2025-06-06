import Lesson from '../models/lesson.js';
import Course from '../models/course.js';

// @desc    Tạo bài học mới
// @route   POST /api/lessons
// @access  Private (Admin/Teacher)
export const createLesson = async (req, res) => {
    try {
        const { title, description, course, contentType, contentUrl, contentText, order, duration } = req.body;

        // Kiểm tra khóa học tồn tại
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
        }

        // Kiểm tra trùng thứ tự
        const orderExists = await Lesson.findOne({ course, order });
        if (orderExists) {
            return res.status(400).json({ message: `Thứ tự ${order} đã tồn tại trong khóa học.` });
        }

        // Tạo bài học mới
        const lesson = await Lesson.create({
            title,
            description,
            course,
            contentType,
            contentUrl,
            contentText,
            order,
            duration,
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error('Lỗi khi tạo bài học:', error);
        res.status(500).json({ message: 'Không thể tạo bài học', error: error.message });
    }
};

// @desc    Lấy tất cả bài học theo khóa học
// @route   GET /api/lessons/course/:courseId
// @access  Public
export const getLessonsByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');

        if (!lessons || lessons.length === 0) {
            const course = await Course.findById(req.params.courseId);
            if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
            return res.status(200).json([]);
        }

        res.status(200).json(lessons);
    } catch (error) {
        console.error('Lỗi khi lấy bài học:', error);
        res.status(500).json({ message: 'Không thể lấy bài học', error: error.message });
    }
};
export const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .sort({ createdAt: -1 }) // sắp xếp mới nhất lên đầu (tùy chọn)
            .populate('course', 'title'); // lấy thông tin khóa học

        res.status(200).json(lessons);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài học:', error);
        res.status(500).json({ message: 'Không thể lấy bài học', error: error.message });
    }
};
// @desc    Lấy chi tiết một bài học
// @route   GET /api/lessons/:id
// @access  Public
export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('course', 'title');
        if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });
        res.status(200).json(lesson);
    } catch (error) {
        console.error('Lỗi khi lấy bài học:', error);
        res.status(500).json({ message: 'Không thể lấy bài học', error: error.message });
    }
};

// @desc    Cập nhật bài học
// @route   PUT /api/lessons/:id
// @access  Private
export const updateLesson = async (req, res) => {
    try {
        const {
            title,
            description,
            contentType,
            contentUrl,
            contentText,
            order,
            duration,
            course, // 👈 THÊM NÀY
        } = req.body;

        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });

        // Nếu đổi thứ tự thì kiểm tra trùng trong khóa học mới (nếu có)
        const newCourse = course || lesson.course;
        if (order && order !== lesson.order) {
            const orderExists = await Lesson.findOne({
                course: newCourse,
                order,
                _id: { $ne: lesson._id }, // không tính chính nó
            });

            if (orderExists) {
                return res.status(400).json({ message: `Thứ tự ${order} đã tồn tại trong khóa học.` });
            }

            lesson.order = order;
        }

        // Cập nhật các trường
        lesson.title = title || lesson.title;
        lesson.description = description || lesson.description;
        lesson.contentType = contentType || lesson.contentType;
        lesson.contentUrl = contentUrl || lesson.contentUrl;
        lesson.contentText = contentText || lesson.contentText;
        lesson.duration = duration ?? lesson.duration;
        lesson.course = course || lesson.course; // 👈 CẬP NHẬT KHÓA HỌC MỚI

        const updated = await lesson.save();
        res.status(200).json(updated);
    } catch (error) {
        console.error('Lỗi khi cập nhật bài học:', error);
        res.status(500).json({ message: 'Không thể cập nhật bài học', error: error.message });
    }
};

// @desc    Xóa bài học
// @route   DELETE /api/lessons/:id
// @access  Private
export const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });

        await Lesson.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Bài học đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa bài học:', error);
        res.status(500).json({ message: 'Không thể xóa bài học', error: error.message });
    }
};
