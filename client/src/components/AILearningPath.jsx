import React, { useState } from 'react';
import {
    Typography,
    Input,
    Select,
    InputNumber,
    Button,
    Alert,
    Card,
    Row,
    Col,
    Spin,
    Space,
    message,
} from 'antd';
import { marked } from 'marked';
import axiosInstance from '../config/axios';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AILearningPath = () => {
    const [formData, setFormData] = useState({
        level: 'beginner',
        goal: '',
        freeHours: 1,
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedCourses, setSuggestedCourses] = useState([]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const extractCoursesFromMarkdown = (markdown) => {
        const courses = [];
        const regex = /\[([^\]]+)\]\(\/courses\/([a-f\d]{24})\)/gi;
        let match;

        while ((match = regex.exec(markdown)) !== null) {
            const title = match[1];
            const courseId = match[2];
            courses.push({
                title,
                url: `/courses/${courseId}`,
            });
        }

        return courses;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setSuggestedCourses([]);

        try {
            const response = await axiosInstance.post('/api/ai/learning-path', formData);
            setResult(response.data.path);

            const extractedCourses = extractCoursesFromMarkdown(response.data.path);
            setSuggestedCourses(extractedCourses);
            message.success('Tạo lộ trình thành công!');
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Đã xảy ra lỗi';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <Title level={2}>Tạo Lộ Trình Học Tập AI</Title>

            <Card style={{ marginBottom: 24 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <label>Trình độ</label>
                        <Select
                            value={formData.level}
                            onChange={(value) => handleChange('level', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="beginner">Mới bắt đầu</Option>
                            <Option value="intermediate">Trung cấp</Option>
                            <Option value="advanced">Nâng cao</Option>
                        </Select>
                    </div>

                    <div>
                        <label>Mục tiêu học tập</label>
                        <Input
                            name="goal"
                            value={formData.goal}
                            onChange={(e) => handleChange('goal', e.target.value)}
                            placeholder="VD: Trở thành Full-stack Developer"
                        />
                    </div>

                    <div>
                        <label>Thời gian học mỗi ngày (giờ)</label>
                        <InputNumber
                            name="freeHours"
                            value={formData.freeHours}
                            min={0.5}
                            max={24}
                            step={0.5}
                            style={{ width: '100%' }}
                            onChange={(value) => handleChange('freeHours', value)}
                        />
                    </div>

                    <Button
                        type="primary"
                        block
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Tạo Lộ Trình Học Tập
                    </Button>
                </Space>
            </Card>

            {error && (
                <Alert message={error} type="error" showIcon closable style={{ marginBottom: 24 }} />
            )}

            {/* Gợi ý khóa học */}
            {suggestedCourses.length > 0 && (
                <Card title="Khóa Học Được Gợi Ý" style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]}>
                        {suggestedCourses.map((course, idx) => (
                            <Col xs={24} md={12} key={idx}>
                                <Card hoverable>
                                    <Title level={5}>{course.title}</Title>
                                    <a href={course.url}>Xem khóa học</a>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}

            {/* Hiển thị lộ trình AI */}
            {result && (
                <Card title="Lộ Trình Học Tập Của Bạn">
                    <div
                        style={{
                            lineHeight: 1.7,
                        }}
                        dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                    />
                </Card>
            )}

            {loading && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};

export default AILearningPath;
