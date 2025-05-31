import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authAPI';

let initialUser = null;
try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
        initialUser = JSON.parse(storedUser);
    }
} catch (error) {
    console.warn('Invalid user data in localStorage', error);
}

const initialState = {
    user: initialUser,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isAuthenticated: !!(localStorage.getItem('token') && initialUser),
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
    try {
        const data = await loginUser(email, password);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const data = await registerUser(userData);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Register failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log("Login fulfilled payload:", action.payload);
                state.loading = false;
                const { token, user } = action.payload || {};
                if (!token || !user) {
                    state.error = "Invalid login response";
                    return;
                }
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
