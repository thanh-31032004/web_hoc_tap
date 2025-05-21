// src/routes/aiRoutes.js
import express from 'express';
import { suggestRoadmap, getMyRoadmap } from '../controller/Aicontroller';
import { protect } from '../middleware/middleware';

const aiRoute = express.Router();

// Các route yêu cầu người dùng đã đăng nhập
aiRoute.post('/suggest-roadmap', protect, suggestRoadmap); // Gợi ý lộ trình
aiRoute.get('/my-roadmap', protect, getMyRoadmap);         // Lấy lộ trình đã gợi ý của người dùng

export default aiRoute;