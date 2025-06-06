import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlide';
import courseReducer from '../features/course/courseSlide';
import lessonReducer from '../features/lesson/lessonSlide';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        lesson: lessonReducer
    },
});
