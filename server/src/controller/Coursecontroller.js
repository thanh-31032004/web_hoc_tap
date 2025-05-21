// src/controllers/courseController.js
import Course from '../models/course.js';
import Module from '../models/module.js';
import Lesson from '../models/lesson.js';

/**
 * @desc    Lấy tất cả các khóa học
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách khóa học', error: error.message });
    }
};

/**
 * @desc    Lấy chi tiết một khóa học và các module/bài học của nó
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Lấy tất cả các module của khóa học đó và sắp xếp theo thứ tự
            const modules = await Module.find({ course: course._id }).sort('order');

            // Với mỗi module, lấy các bài học của nó và sắp xếp
            const courseWithContent = {
                ...course.toObject(), // Chuyển đổi Mongoose document thành plain JS object
                modules: await Promise.all(
                    modules.map(async (mod) => {
                        const lessons = await Lesson.find({ module: mod._id, course: course._id }).sort('order');
                        return { ...mod.toObject(), lessons };
                    })
                ),
            };
            res.status(200).json(courseWithContent);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết khóa học', error: error.message });
    }
};

