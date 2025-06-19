import axiosInstance from '../../config/axios';

// Mark lesson as completed
export const completeLesson = async (lessonId) => {
    const response = await axiosInstance.post('/progress/complete-lesson', { lessonId });
    return response.data;
};

// Get lesson completion status
export const getLessonStatus = async (lessonId) => {
    const response = await axiosInstance.get(`/progress/status/${lessonId}`);
    return response.data;
};

// Get course progress
export const getCourseProgress = async (courseId) => {
    const response = await axiosInstance.get(`/progress/course/${courseId}`);
    return response.data;
};

// Get overall progress
export const getOverallProgress = async () => {
    const response = await axiosInstance.get('/progress/overall');
    return response.data;
};

// Update current lesson
export const updateCurrentLesson = async (data) => {
    const response = await axiosInstance.put('/progress/current-lesson', data);
    return response.data;
};

// ✅ Get current lesson for profile page
export const getCurrentLesson = async () => {
    const response = await axiosInstance.get('/progress/current-lesson');
    return response.data;
};
