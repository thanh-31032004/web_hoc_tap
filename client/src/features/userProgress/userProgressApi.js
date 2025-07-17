import axiosInstance from '../../config/axios';

const userProgressApi = {
    // Đánh dấu bài học hoàn thành
    markLessonAsCompleted: (lessonId) =>
        axiosInstance.post('/progress/lessons/complete', { lessonId }),

    // Lấy trạng thái bài học
    getLessonStatus: (lessonId) =>
        axiosInstance.get(`/progress/lessons/${lessonId}/status`),

    // Lấy tiến độ khóa học
    getCourseProgress: (courseId) =>
        axiosInstance.get(`/progress/courses/${courseId}`),

    // Lấy tổng quan tiến độ
    getOverallProgress: () =>
        axiosInstance.get('/progress/overview'),

    // Cập nhật bài học hiện tại
    updateCurrentLesson: (lessonId, courseId) =>
        axiosInstance.put('/progress/current-lesson', { lessonId, courseId }),

    // Lấy bài học hiện tại
    getCurrentLesson: () =>
        axiosInstance.get('/progress/current-lesson')
};

export default userProgressApi;