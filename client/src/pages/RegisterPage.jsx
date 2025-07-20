// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Form, Input, Button, Typography, Alert, Spin
} from 'antd';
import { register } from '../features/auth/authSlide';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

function RegisterPage() {
    const [form] = Form.useForm();
    const [localError, setLocalError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Đăng kí thành công!");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleFinish = (values) => {
        const { email, username, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            setLocalError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        setLocalError(null);
        dispatch(register({ email, username, password }));
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Đăng ký</Title>

            {localError && <Alert message={localError} type="error" showIcon style={{ marginBottom: 16 }} />}
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
            >
                <Form.Item
                    name="username"
                    label="Tên người dùng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                >
                    <Input placeholder="Tên người dùng" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        disabled={loading}
                    >
                        {loading ? <Spin size="small" /> : 'Đăng ký'}
                    </Button>
                </Form.Item>

                <Text style={{ display: 'block', textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </Text>
            </Form>
        </div>
    );
}

export default RegisterPage;
