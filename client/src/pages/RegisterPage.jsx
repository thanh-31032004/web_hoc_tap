// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    TextField, Button, Typography, Container, Box,
    Alert, CircularProgress
} from '@mui/material';
import { register } from '../features/auth/authSlide';

function RegisterPage() {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [localError, setLocalError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setLocalError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        setLocalError(null);
        dispatch(register({
            email: form.email,
            username: form.username,
            password: form.password
        }));
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Đăng ký</Typography>

                {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        name="username"
                        fullWidth
                        label="Tên người dùng"
                        value={form.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        name="email"
                        fullWidth
                        label="Email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        type="email"
                    />
                    <TextField
                        name="password"
                        type="password"
                        fullWidth
                        label="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        label="Xác nhận mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Đã có tài khoản? <RouterLink to="/login">Đăng nhập</RouterLink>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterPage;
