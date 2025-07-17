import { Router } from 'express';
import { getAdminStats } from '../controller/Totalcontroller.js';
import { protect } from '../middleware/middleware.js';

const totalrouter = Router();

totalrouter.get('/stats', protect, getAdminStats);

export default totalrouter;
