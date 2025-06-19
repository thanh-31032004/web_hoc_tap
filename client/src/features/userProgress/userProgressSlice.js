import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userProgressApi from './userProgressApi';

const initialState = {
    currentLesson: null,
    completedLessons: [],
    courseProgress: {},
    overallProgress: null,
    loading: false,
    error: null
};

// ✅ New: fetch current lesson for ProfilePage
export const fetchCurrentLesson = createAsyncThunk(
    'userProgress/fetchCurrentLesson',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getCurrentLesson();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch current lesson');
        }
    }
);

export const markLessonAsCompleted = createAsyncThunk(
    'userProgress/markLessonAsCompleted',
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.completeLesson(lessonId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson as completed');
        }
    }
);

export const fetchLessonStatus = createAsyncThunk(
    'userProgress/fetchLessonStatus',
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getLessonStatus(lessonId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson status');
        }
    }
);

export const fetchCourseProgress = createAsyncThunk(
    'userProgress/fetchCourseProgress',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getCourseProgress(courseId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course progress');
        }
    }
);

export const fetchOverallProgress = createAsyncThunk(
    'userProgress/fetchOverallProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getOverallProgress();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch overall progress');
        }
    }
);

export const updateCurrentLesson = createAsyncThunk(
    'userProgress/updateCurrentLesson',
    async (data, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.updateCurrentLesson(data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update current lesson');
        }
    }
);

const userProgressSlice = createSlice({
    name: 'userProgress',
    initialState,
    reducers: {
        resetProgress: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            // ✅ Fetch current lesson
            .addCase(fetchCurrentLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.currentLesson = action.payload;
            })
            .addCase(fetchCurrentLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark lesson as completed
            .addCase(markLessonAsCompleted.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markLessonAsCompleted.fulfilled, (state, action) => {
                state.loading = false;
                state.completedLessons.push(action.payload);
                state.courseProgress[action.payload.course] = action.payload;
            })
            .addCase(markLessonAsCompleted.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch lesson status
            .addCase(fetchLessonStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessonStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.completedLessons = action.payload.isCompleted
                    ? [...state.completedLessons, action.payload.lessonId]
                    : state.completedLessons;
            })
            .addCase(fetchLessonStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch course progress
            .addCase(fetchCourseProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.courseProgress[action.payload.courseId] = action.payload;
            })
            .addCase(fetchCourseProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch overall progress
            .addCase(fetchOverallProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOverallProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.overallProgress = action.payload;
            })
            .addCase(fetchOverallProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update current lesson
            .addCase(updateCurrentLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCurrentLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.currentLesson = action.payload;
            })
            .addCase(updateCurrentLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetProgress } = userProgressSlice.actions;
export default userProgressSlice.reducer;
