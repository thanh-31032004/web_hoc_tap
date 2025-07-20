import React, { useEffect, useState } from 'react';
import {
    Typography,
    Spin,
    Card,
    Button,
    Row,
    Col,
    Avatar,
    Space,
    Divider,
    Alert,
    Progress,
    Descriptions,
    Pagination,
    Input,
} from 'antd';
import {
    UserOutlined,
    ArrowRightOutlined,
    BookOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const { Title, Text } = Typography;

const ProfilePage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [progressAll, setProgressAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    const fetchData = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);

            const resCourses = await axiosInstance.get('/courses');
            setCourses(resCourses.data);

            const resProgress = await axiosInstance.get('/progress/all');
            const merged = mergeProgressData(resProgress.data);
            setProgressAll(merged);
        } catch (err) {
            console.error(err);
            setError('Không thể tải dữ liệu hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    const mergeProgressData = (progressList) => {
        const groupByCourse = {};
        for (const item of progressList) {
            const id = item.courseId;
            if (!groupByCourse[id]) {
                groupByCourse[id] = [];
            }
            groupByCourse[id].push(item);
        }

        const merged = Object.entries(groupByCourse).map(([courseId, items]) => {
            let progressPercentage = 0;
            let completedLessons = [];
            let lastAccessedLesson = null;
            let totalLessons = 0;

            for (const it of items) {
                progressPercentage = Math.max(progressPercentage, it.progressPercentage || 0);
                totalLessons = it.totalLessons || totalLessons;
                if (it.completedLessons) {
                    completedLessons = [...completedLessons, ...it.completedLessons];
                }
                if (it.lastAccessedLesson) {
                    if (
                        !lastAccessedLesson ||
                        new Date(it.lastAccessedLesson.accessedAt) > new Date(lastAccessedLesson.accessedAt)
                    ) {
                        lastAccessedLesson = it.lastAccessedLesson;
                    }
                }
            }

            return {
                courseId,
                progressPercentage,
                completedLessons,
                lastAccessedLesson,
                totalLessons,
            };
        });

        return merged;
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
                <Alert message="Vui lòng đăng nhập để xem trang cá nhân." type="error" showIcon />
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    const filteredProgress = progressAll
        .filter(p => {
            const course = courses.find(c => c._id === p.courseId);
            const title = course?.title?.toLowerCase() || '';
            return title.includes(searchTerm.toLowerCase());
        })
        .filter(p => p.progressPercentage > 0);

    const paginatedProgress = filteredProgress.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: 32, color: '#1a237e' }}>
                Tổng quan học tập
            </Title>
            <Row gutter={24}>
                <Col xs={24} md={8}>
                    <Card>
                        <Space direction="vertical" align="center" style={{ width: '100%' }}>
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#fa541c' }}
                            >
                                {user?.username?.[0]?.toUpperCase()}
                            </Avatar>
                            <Title level={4}>{user?.username || 'Học viên'}</Title>
                            <Descriptions size="small" column={1} style={{ textAlign: 'left', width: '100%' }}>
                                <Descriptions.Item label="Email">{user?.email || 'Không có email'}</Descriptions.Item>
                                <Descriptions.Item label="Vai trò">
                                    {user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Cấp độ  ">{user?.skillLevel || 'Không rõ'}</Descriptions.Item>
                                <Descriptions.Item label="Mục tiêu">{user?.learningGoals || 'Không rõ'}</Descriptions.Item>
                                <Descriptions.Item label="Sở thích học tập">{user?.learningPreferences || 'Không rõ'}</Descriptions.Item>
                                <Descriptions.Item label="Số khóa học đang học">{progressAll.length}</Descriptions.Item>
                                <Descriptions.Item label="Tổng bài học đã hoàn thành">
                                    {progressAll.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tiến độ trung bình">
                                    {progressAll.length > 0
                                        ? `${Math.round(progressAll.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / progressAll.length)}%`
                                        : '0%'}
                                </Descriptions.Item>
                            </Descriptions>
                            <Button onClick={() => navigate('/settings/profile')}>
                                Chỉnh sửa hồ sơ
                            </Button>
                            {user?.role === 'admin' && (
                                <Button type="primary" onClick={() => navigate('/admin')}>
                                    Đến trang Admin
                                </Button>
                            )}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card style={{ marginBottom: 24 }}>
                        <Input.Search
                            placeholder="Tìm kiếm khóa học..."
                            allowClear
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ marginBottom: 16 }}
                        />
                    </Card>

                    {filteredProgress.length === 0 ? (
                        <Card>
                            <Title level={4}>Không tìm thấy khóa học phù hợp.</Title>
                            <Text>
                                Thử lại với từ khóa khác hoặc khám phá thêm khóa học nhé!
                            </Text>
                            <Divider />
                            <Button type="primary" icon={<BookOutlined />} onClick={() => navigate('/')}>
                                Khám phá khóa học
                            </Button>
                        </Card>
                    ) : (
                        paginatedProgress.map(progress => {
                            const course = courses.find(c => c._id === progress.courseId);
                            const courseTitle = course?.title || 'Khóa học';
                            const completedCount = progress.completedLessons.length;
                            const totalLessons = progress.totalLessons || 0;
                            const percentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
                            const lastLessonTitle = progress.lastAccessedLesson?.lesson?.title || 'Chưa có bài học gần nhất';
                            const lastLessonId = progress.lastAccessedLesson?.lesson?._id;

                            return (
                                <Card key={progress.courseId} style={{ marginBottom: 24 }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Space>
                                            <TeamOutlined style={{ color: '#1890ff' }} />
                                            <Title level={5}>{courseTitle}</Title>
                                        </Space>
                                        <Text>Bài học gần nhất: <strong>{lastLessonTitle}</strong></Text>
                                        <Progress percent={Math.round(percentage)} status="active" />
                                        <Text type="secondary">{completedCount}/{totalLessons} bài học</Text>
                                        <Divider />
                                        <Button
                                            type="primary"
                                            icon={<ArrowRightOutlined />}
                                            disabled={!lastLessonId}
                                            onClick={() =>
                                                navigate(`/courses/${progress.courseId}/lessons/${lastLessonId}`)
                                            }
                                        >
                                            Vào học ngay
                                        </Button>
                                    </Space>
                                </Card>
                            );
                        })
                    )}

                    {filteredProgress.length > pageSize && (
                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProgress.length}
                                onChange={page => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
