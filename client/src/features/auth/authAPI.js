// src/features/auth/authAPI.js
import axiosInstance from '../../config/axios';

export const loginUser = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    console.log('Login response:', response.data); // 👈 log response
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};
