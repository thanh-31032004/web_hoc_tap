import axiosInstance from '../../config/axios';

const courseApi = {
    getAll: () => axiosInstance.get('/courses'),
    create: (data) => axiosInstance.post('/courses', data),
    update: (id, data) => axiosInstance.put(`/courses/${id}`, data),
    remove: (id) => axiosInstance.delete(`/courses/${id}`),
};

export default courseApi;
