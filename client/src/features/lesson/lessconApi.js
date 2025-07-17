// src/api/lessonApi.js
import axiosInstance from '../../config/axios';

const lessonApi = {
    getAll: () => axiosInstance.get('/lessons'),
    getById: (id) => axiosInstance.get(`/lessons/${id}`),
    create: (data) => axiosInstance.post('/lessons', data),
    update: (id, data) => axiosInstance.put(`/lessons/${id}`, data),
    remove: (id) => axiosInstance.delete(`/lessons/${id}`),
};

export default lessonApi;