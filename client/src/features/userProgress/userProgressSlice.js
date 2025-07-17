import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userProgressApi from './userProgressApi';

const initialState = {
    status: {}, // { [lessonId]: boolean }
    current: null, // { lesson: {...}, accessedAt: Date }
    byCourse: {}, // { [courseId]: { progressPercentage, ... } }
    overview: {}, // { [courseId]: progressData }
    loading: false,
    error: null
};

// Fetch bài học hiện tại
export const fetchCurrentLesson = createAsyncThunk(
    'userProgress/fetchCurrentLesson',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getCurrentLesson();
            return response.data.lastAccessedLesson; // Chỉ lấy dữ liệu từ response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy bài học hiện tại');
        }
    }
);

export const markLessonAsCompleted = createAsyncThunk(
    'userProgress/markLessonAsCompleted',
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.markLessonAsCompleted(lessonId);
            return response.data.progress; // Chỉ lấy dữ liệu từ response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể đánh dấu bài học hoàn thành');
        }
    }
);

export const fetchLessonStatus = createAsyncThunk(
    'userProgress/fetchLessonStatus',
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getLessonStatus(lessonId);
            return {
                lessonId,
                isCompleted: response.data.isCompleted // Chỉ lấy dữ liệu từ response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy trạng thái bài học');
        }
    }
);

export const fetchCourseProgress = createAsyncThunk(
    'userProgress/fetchCourseProgress',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getCourseProgress(courseId);
            return {
                courseId,
                progress: response.data // Chỉ lấy dữ liệu từ response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy tiến độ khóa học');
        }
    }
);

export const fetchOverallProgress = createAsyncThunk(
    'userProgress/fetchOverallProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.getOverallProgress();
            return response.data.progressByCourse; // Chỉ lấy dữ liệu từ response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy tổng quan tiến độ');
        }
    }
);

export const updateCurrentLesson = createAsyncThunk(
    'userProgress/updateCurrentLesson',
    async ({ lessonId, courseId }, { rejectWithValue }) => {
        try {
            const response = await userProgressApi.updateCurrentLesson(lessonId, courseId);
            return response.data.lastAccessedLesson; // Chỉ lấy dữ liệu từ response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật bài học hiện tại');
        }
    }
);

const userProgressSlice = createSlice({
    name: 'userProgress',
    initialState,
    reducers: {
        resetProgress: () => initialState,
        setLessonStatus: (state, action) => {
            const { lessonId, status } = action.payload;
            state.status[lessonId] = status;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý các action fulfilled cụ thể - ĐẶT TRƯỚC addMatcher
            .addCase(fetchCurrentLesson.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(markLessonAsCompleted.fulfilled, (state, action) => {
                const { courseId, completedLessons } = action.payload;

                completedLessons.forEach(lesson => {
                    state.status[lesson.lesson._id] = true;
                });

                if (state.byCourse[courseId]) {
                    state.byCourse[courseId] = {
                        ...state.byCourse[courseId],
                        progressPercentage: action.payload.progressPercentage,
                        completedLessons
                    };
                }
            })
            .addCase(fetchLessonStatus.fulfilled, (state, action) => {
                const { lessonId, isCompleted } = action.payload;
                state.status[lessonId] = isCompleted;
            })
            .addCase(fetchCourseProgress.fulfilled, (state, action) => {
                const { courseId, progress } = action.payload;
                state.byCourse[courseId] = progress;

                progress.completedLessons?.forEach(lesson => {
                    state.status[lesson.lesson._id] = true;
                });
            })
            .addCase(fetchOverallProgress.fulfilled, (state, action) => {
                state.overview = action.payload;

                Object.values(action.payload).forEach(courseProgress => {
                    courseProgress.completedLessons?.forEach(lesson => {
                        state.status[lesson.lesson._id] = true;
                    });
                });
            })
            .addCase(updateCurrentLesson.fulfilled, (state, action) => {
                state.current = action.payload;

                if (action.payload.lesson) {
                    state.status[action.payload.lesson._id] = false;
                }
            })

            // Xử lý chung cho tất cả pending - ĐẶT SAU addCase
            .addMatcher(
                action => action.type.startsWith('userProgress/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // Xử lý chung cho tất cả fulfilled - ĐẶT SAU addCase
            .addMatcher(
                action => action.type.startsWith('userProgress/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )

            // Xử lý chung cho tất cả rejected - ĐẶT SAU addCase
            .addMatcher(
                action => action.type.startsWith('userProgress/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { resetProgress, setLessonStatus } = userProgressSlice.actions;
export default userProgressSlice.reducer;