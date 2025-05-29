// src/controllers/courseController.js
import Course from '../models/course.js';
import Module from '../models/module.js'; // Đảm bảo bạn có Model Module
import Lesson from '../models/lesson.js'; // Đảm bảo bạn có Model Lesson

/**
 * @desc    Tạo khóa học mới
 * @route   POST /api/courses
 * @access  Private/Admin (Chỉ admin hoặc giáo viên mới có thể tạo)
 */
export const createCourse = async (req, res) => {
    try {
        // Lấy thông tin cần thiết từ body của request
        const { title, description, category, price, duration, imageUrl } = req.body;

        // Kiểm tra xem đã có khóa học nào với tiêu đề này chưa (tùy chọn)
        const courseExists = await Course.findOne({ title });
        if (courseExists) {
            return res.status(400).json({ message: 'Tên khóa học đã tồn tại. Vui lòng chọn tên khác.' });
        }

        // Tạo khóa học mới trong database
        const course = await Course.create({
            title,
            description,
            category,
            price,
            duration,
            imageUrl,
            // Thêm trường 'creator' nếu bạn muốn lưu ID người tạo khóa học
            // creator: req.user._id, // Chỉ dùng nếu bạn có middleware 'protect' và 'req.user'
        });

        // Gửi phản hồi về khóa học vừa tạo
        res.status(201).json(course);

    } catch (error) {
        console.error("Lỗi khi tạo khóa học:", error);
        // Xử lý lỗi validation hoặc lỗi server khác
        res.status(500).json({ message: 'Không thể tạo khóa học', error: error.message });
    }
};


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
                        // Đảm bảo Lesson Model của bạn có trường 'module' nếu bạn dùng cấu trúc này
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