// src/utils/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, // Nếu dùng cookie, nếu không thì bỏ
});

// Gắn interceptor để tự động thêm Authorization token từ localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: xử lý 401, logout toàn cục
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Bạn có thể dispatch logout ở đây nếu dùng Redux
            console.warn("Unauthorized. Maybe token expired?");
            // window.location.href = "/login"; // hoặc dùng navigate()
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
