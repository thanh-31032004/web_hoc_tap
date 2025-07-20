// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../features/auth/authSlide';
import {
    Form,
    Input,
    Button,
    Typography,
    Alert,
    Spin
} from 'antd';
import { toast } from 'react-toastify';
const { Title, Text } = Typography;

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Đăng nhập thành công!");
            navigate('/');
            window.location.reload();
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = () => {
        dispatch(login({ email, password }));
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 80 }}>
            <Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Title>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email"
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Text>Chưa có tài khoản? <RouterLink to="/register">Đăng ký ngay</RouterLink></Text>
                </Form.Item>
            </Form>
        </div>
    );
}

export default LoginPage;
