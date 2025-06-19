import Course from '../models/course.js';

import Lesson from '../models/lesson.js';

/**
 * @desc    Tạo khóa học mới
 * @route   POST /api/courses
 * @access  Private/Admin
 */
export const createCourse = async (req, res) => {
    try {
        const { title, description, thumbnail, category, difficulty } = req.body;

        const courseExists = await Course.findOne({ title });
        if (courseExists) {
            return res.status(400).json({ message: 'Tên khóa học đã tồn tại. Vui lòng chọn tên khác.' });
        }

        const course = await Course.create({
            title,
            description,
            thumbnail,
            category,
            difficulty
        });

        res.status(201).json(course);
    } catch (error) {
        console.error("Lỗi khi tạo khóa học:", error);
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
 * @desc    Lấy chi tiết một khóa học kèm modules và lessons
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            const modules = await Module.find({ course: course._id }).sort('order');

            const courseWithContent = {
                ...course.toObject(),
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

/**
 * @desc    Cập nhật thông tin khóa học
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail, category, difficulty } = req.body;

        const course = await Course.findById(id);

        if (course) {
            course.title = title || course.title;
            course.description = description || course.description;
            course.thumbnail = thumbnail || course.thumbnail;
            course.category = category || course.category;
            course.difficulty = difficulty || course.difficulty;

            const updatedCourse = await course.save();

            res.status(200).json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học để cập nhật' });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật khóa học:", error);
        res.status(500).json({ message: 'Không thể cập nhật khóa học', error: error.message });
    }
};

/**
 * @desc    Xóa một khóa học
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 */
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (course) {
            await Course.deleteOne({ _id: id });

            // Xóa module và bài học nếu cần
            // await Module.deleteMany({ course: id });
            // await Lesson.deleteMany({ course: id });

            res.status(200).json({ message: 'Khóa học đã được xóa thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học để xóa' });
        }
    } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        res.status(500).json({ message: 'Không thể xóa khóa học', error: error.message });
    }
};
