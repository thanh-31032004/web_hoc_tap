// src/routes/authRoutes.js
import { Router } from 'express';
import { registerUser, loginUser } from '../controller/Authcontroller.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;