import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    message,
    Space,
    Avatar,
    Checkbox,
    Select
} from 'antd';
import { UserOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProfilePage = () => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            form.setFieldsValue({
                username: storedUser.username,
                email: storedUser.email,
                learningPreferences: storedUser.learningPreferences || [],
                skillLevel: storedUser.skillLevel || 'beginner',
                learningGoals: storedUser.learningGoals || '',
            });
        }
    }, [form]);

    const handleSubmit = async (values) => {
        try {
            const payload = { ...values };
            if (!values.password) {
                delete payload.password;
            }
            const res = await axiosInstance.put('/users/profile', payload);
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success("Cập nhật thành công!");
            message.success('Cập nhật hồ sơ thành công!');
            navigate('/profile');
        } catch (error) {
            console.error(error);
            message.error('Cập nhật thất bại!');
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '50px auto' }}>
            <Card>
                <Space direction="vertical" style={{ width: '100%' }} align="center">
                    <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Title level={3}>Chỉnh sửa hồ sơ</Title>
                </Space>

                <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ marginTop: 24 }}>
                    <Form.Item
                        label="Tên người dùng"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="password"
                        tooltip="Chỉ nhập nếu bạn muốn thay đổi mật khẩu"
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Mục tiêu học tập" name="learningGoals">
                        <TextArea rows={3} placeholder="VD: Trở thành lập trình viên fullstack" />
                    </Form.Item>

                    <Form.Item label="Trình độ kỹ năng" name="skillLevel">
                        <Select>
                            <Option value="beginner">Beginner</Option>
                            <Option value="intermediate">Intermediate</Option>
                            <Option value="advanced">Advanced</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Sở thích học tập" name="learningPreferences">
                        <Checkbox.Group>
                            <Space direction="vertical">
                                <Checkbox value="frontend">Frontend</Checkbox>
                                <Checkbox value="backend">Backend</Checkbox>
                                <Checkbox value="mobile">Mobile</Checkbox>
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/profile')}>
                                Quay lại
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditProfilePage;
