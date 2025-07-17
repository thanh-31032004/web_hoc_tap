import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lessonApi from './lessconApi';

// Fetch tất cả bài học
export const fetchLessons = createAsyncThunk('lessons', async (_, thunkAPI) => {
    try {
        const res = await lessonApi.getAll();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách bài học');
    }
});

// Tạo bài học mới
export const createLesson = createAsyncThunk('lessons/create', async (data, thunkAPI) => {
    try {
        const res = await lessonApi.create(data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo bài học');
    }
});

// Cập nhật bài học
export const updateLesson = createAsyncThunk('lessons/update', async ({ id, data }, thunkAPI) => {
    try {
        const res = await lessonApi.update(id, data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật bài học');
    }
});

// Xóa bài học
export const deleteLesson = createAsyncThunk('lessons/delete', async (id, thunkAPI) => {
    try {
        await lessonApi.remove(id);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa bài học');
    }
});

const lessonSlice = createSlice({
    name: 'lesson',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createLesson.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateLesson.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload._id);
                if (index >= 0) state.list[index] = action.payload;
            })
            .addCase(deleteLesson.fulfilled, (state, action) => {
                state.list = state.list.filter(l => l._id !== action.payload);
            });
    },
});

export default lessonSlice.reducer;