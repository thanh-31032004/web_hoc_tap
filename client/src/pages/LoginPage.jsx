// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Chỉ cần import axios
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/auth/login', { // Chỉ cần đường dẫn tương đối
                email,
                password,
            });

            // Lưu token và thông tin người dùng vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin user (đảm bảo backend trả về user object)

            // Chuyển hướng đến trang profile sau khi đăng nhập thành công
            navigate('/profile');
            window.location.reload(); // Tải lại trang để Navbar cập nhật trạng thái đăng nhập
        } catch (err) {
            // err.response?.data?.message sẽ chứa thông báo lỗi từ backend
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Đăng nhập
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Địa chỉ Email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading} // Vô hiệu hóa nút khi đang tải
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
                    </Button>
                    <Typography variant="body2" align="center">
                        Bạn chưa có tài khoản?{' '}
                        <RouterLink to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Đăng ký ngay
                        </RouterLink>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginPage;