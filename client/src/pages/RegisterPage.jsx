// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Chỉ cần import axios
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }

        try {
            // Axios sẽ tự động thêm baseURL và headers.Authorization (nếu có token)
            const response = await axios.post('/auth/register', { // Chỉ cần đường dẫn tương đối
                username,
                email,
                password,
            });
            setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
            setTimeout(() => navigate('/login'), 2000); // Chuyển hướng sau 2 giây
        } catch (err) {
            // err.response?.data?.message sẽ chứa thông báo lỗi từ backend
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Đăng ký
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên người dùng"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Địa chỉ Email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading} // Vô hiệu hóa nút khi đang tải
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
                    </Button>
                    <Typography variant="body2" align="center">
                        Bạn đã có tài khoản?{' '}
                        <RouterLink to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Đăng nhập ngay
                        </RouterLink>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterPage;