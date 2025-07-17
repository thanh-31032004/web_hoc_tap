// src/routes/authRoutes.js
import { Router } from 'express';
import { protect, isAdmin } from '../middleware/middleware.js';
import { loginUser, registerUser, getAllUsers, deleteUser, updateUserRole } from '../controller/Authcontroller.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/users', protect, getAllUsers);
authRouter.delete('/users/:id', protect, deleteUser);
authRouter.put('/users/:id', updateUserRole);
export default authRouter;