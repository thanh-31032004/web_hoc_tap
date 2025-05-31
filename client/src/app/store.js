import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlide';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});
