import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseApi from './courseApi';

export const fetchCourses = createAsyncThunk('courses', async (_, thunkAPI) => {
    try {
        const res = await courseApi.getAll();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách');
    }
});

export const createCourse = createAsyncThunk('courses/create', async (data, thunkAPI) => {
    try {
        const res = await courseApi.create(data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo khóa học');
    }
});

export const updateCourse = createAsyncThunk('courses/update', async ({ id, data }, thunkAPI) => {
    try {
        const res = await courseApi.update(id, data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật khóa học');
    }
});

export const deleteCourse = createAsyncThunk('courses/delete', async (id, thunkAPI) => {
    try {
        await courseApi.remove(id);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khóa học');
    }
});

const courseSlice = createSlice({
    name: 'course',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c._id === action.payload._id);
                if (index >= 0) state.list[index] = action.payload;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.list = state.list.filter(c => c._id !== action.payload);
            });
    },
});

export default courseSlice.reducer;
