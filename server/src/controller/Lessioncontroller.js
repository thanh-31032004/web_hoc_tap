// src/controllers/lessonController.js
import Lesson from '../models/lesson.js'; // Đảm bảo đường dẫn đúng
import Course from '../models/course.js'; // Cần để kiểm tra khóa học tồn tại

// @desc    Tạo bài học mới
// @route   POST /api/lessons
// @access  Private (Admin/Teacher) - Bạn có thể thêm middleware protect và authorize ở đây
export const createLesson = async (req, res) => {
    try {
        const { title, description, videoUrl, content, course, order } = req.body;

        // Kiểm tra xem khóa học có tồn tại không
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học để thêm bài học vào.' });
        }

        // Kiểm tra xem thứ tự bài học đã tồn tại trong khóa học này chưa
        const orderExists = await Lesson.findOne({ course, order });
        if (orderExists) {
            return res.status(400).json({ message: `Bài học với thứ tự ${order} đã tồn tại trong khóa học này.` });
        }

        const lesson = await Lesson.create({ title, description, videoUrl, content, course, order });
        res.status(201).json(lesson);
    } catch (error) {
        console.error("Lỗi khi tạo bài học:", error);
        res.status(500).json({ message: 'Không thể tạo bài học', error: error.message });
    }
};

// @desc    Lấy tất cả bài học của một khóa học cụ thể
// @route   GET /api/lessons/course/:courseId
// @access  Public
export const getLessonsByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId })
            .sort('order') // Sắp xếp theo thứ tự
            .populate('course', 'title description'); // Lấy thêm thông tin khóa học

        if (!lessons || lessons.length === 0) {
            // Có thể muốn trả về 200 [] nếu không có bài học nào, hoặc 404 nếu khóa học không tồn tại
            const existingCourse = await Course.findById(req.params.courseId);
            if (!existingCourse) {
                return res.status(404).json({ message: 'Không tìm thấy khóa học này.' });
            }
            return res.status(200).json([]); // Khóa học tồn tại nhưng không có bài học
        }

        res.status(200).json(lessons);
    } catch (error) {
        console.error("Lỗi khi lấy bài học theo khóa học:", error);
        res.status(500).json({ message: 'Không thể lấy bài học', error: error.message });
    }
};

// @desc    Lấy chi tiết một bài học cụ thể
// @route   GET /api/lessons/:id
// @access  Public
export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('course', 'title description');
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        console.error("Lỗi khi lấy bài học theo ID:", error);
        res.status(500).json({ message: 'Không thể lấy bài học', error: error.message });
    }
};

// @desc    Cập nhật thông tin bài học
// @route   PUT /api/lessons/:id
// @access  Private (Admin/Teacher)
export const updateLesson = async (req, res) => {
    try {
        const { title, description, videoUrl, content, order } = req.body;

        // Kiểm tra xem bài học có tồn tại không
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học để cập nhật' });
        }

        // Kiểm tra xem thứ tự mới có bị trùng không (nếu thay đổi thứ tự)
        if (order && order !== lesson.order) {
            const orderExists = await Lesson.findOne({ course: lesson.course, order });
            if (orderExists) {
                return res.status(400).json({ message: `Bài học với thứ tự ${order} đã tồn tại trong khóa học này.` });
            }
            lesson.order = order;
        }

        lesson.title = title || lesson.title;
        lesson.description = description || lesson.description;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        lesson.content = content || lesson.content;

        const updatedLesson = await lesson.save();
        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error("Lỗi khi cập nhật bài học:", error);
        res.status(500).json({ message: 'Không thể cập nhật bài học', error: error.message });
    }
};

// @desc    Xóa bài học
// @route   DELETE /api/lessons/:id
// @access  Private (Admin/Teacher)
export const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học để xóa' });
        }

        await Lesson.deleteOne({ _id: req.params.id }); // Sử dụng deleteOne hoặc deleteMany
        res.status(200).json({ message: 'Bài học đã được xóa thành công' });
    } catch (error) {
        console.error("Lỗi khi xóa bài học:", error);
        res.status(500).json({ message: 'Không thể xóa bài học', error: error.message });
    }
};