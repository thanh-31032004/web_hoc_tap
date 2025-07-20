import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import ReactPlayer from 'react-player/youtube';
import ReactMarkdown from 'react-markdown';

import {
    Typography,
    Spin,
    Alert,
    Button,
    Card,
    Tag,
    Space,
    message,
} from 'antd';
import {
    CheckCircleOutlined,
    PlayCircleOutlined,
    LeftOutlined,
    RightOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title, Paragraph, Text } = Typography;

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isLessonCompleted, setIsLessonCompleted] = useState(false);
    const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = !!localStorage.getItem('token');
    const watchThreshold = 0.8;

    const fetchLessons = async () => {
        const res = await axiosInstance.get('/lessons');
        return res.data;
    };

    const fetchLessonStatus = async (lessonId) => {
        try {
            const res = await axiosInstance.get(`/progress/lessons/${lessonId}/status`);
            return res.data.isCompleted;
        } catch {
            return false;
        }
    };

    const markLessonAsCompleted = async (lessonId) => {
        try {
            await axiosInstance.post('/progress/lessons/complete', { lessonId });
            setIsLessonCompleted(true);
            toast.success("Đánh dấu thành công!");
            message.success('Đã đánh dấu hoàn thành!');
        } catch {
            message.error('Không thể đánh dấu hoàn thành.');
        }
    };

    const updateCurrentLesson = async (courseId, lessonId) => {
        try {
            await axiosInstance.put('/progress/current-lesson', { courseId, lessonId });
        } catch { }
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const lessonsData = await fetchLessons();
                const filtered = lessonsData.filter(l => l.course === courseId || l.course?._id === courseId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                const idx = filtered.findIndex(l => l._id === lessonId);
                const current = filtered[idx];

                setLessons(filtered);
                setCurrentLesson(current);
                setCurrentIndex(idx);

                if (current && isAuthenticated) {
                    setIsLessonCompleted(await fetchLessonStatus(current._id));
                    await updateCurrentLesson(courseId, current._id);
                    setHasWatchedEnough(false);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseId, lessonId]);

    const handleProgress = (state) => {
        if (currentLesson?.contentType === 'video' && state.played >= watchThreshold) {
            setHasWatchedEnough(true);
        }
    };

    const handleMarkComplete = () => {
        if (isAuthenticated && !isLessonCompleted) {
            markLessonAsCompleted(lessonId);
        }
    };

    const handleNavigate = (dir) => {
        const nextIdx = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIdx >= 0 && nextIdx < lessons.length) {
            navigate(`/courses/${courseId}/lessons/${lessons[nextIdx]._id}`);
        }
    };

    if (loading || !currentLesson) {
        return <Spin tip="Đang tải bài học..." fullscreen />;
    }

    if (error) {
        return <Alert type="error" message="Lỗi" description={error} showIcon />;
    }

    return (
        <Card style={{ maxWidth: 900, margin: '40px auto' }}>
            <Button type="link" icon={<LeftOutlined />} onClick={() => navigate(`/courses/${courseId}`)}>Quay lại Khóa học</Button>

            <Title level={3}>{currentLesson.title}</Title>

            <Space style={{ marginBottom: 16 }}>
                {isLessonCompleted ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Đã hoàn thành</Tag>
                ) : isAuthenticated ? (
                    <Tag icon={<PlayCircleOutlined />} color="blue">Đang học</Tag>
                ) : (
                    <Tag color="orange">Đăng nhập để lưu tiến độ</Tag>
                )}
            </Space>

            <div style={{ marginBottom: 24 }}>
                {currentLesson.contentType === 'video' ? (
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <ReactPlayer
                            url={currentLesson.contentUrl}
                            controls
                            onProgress={handleProgress}
                            playing
                            progressInterval={500}
                            width="100%"
                            height="100%"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        />
                    </div>
                ) : currentLesson.contentType === 'text' ? (
                    <ReactMarkdown>{currentLesson.contentText}</ReactMarkdown>
                ) : (
                    <Alert message="Nội dung không khả dụng." type="warning" />
                )}
            </div>

            {isAuthenticated && !isLessonCompleted && (hasWatchedEnough || currentLesson.contentType === 'text') && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleMarkComplete}>Đánh dấu hoàn thành</Button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <Button onClick={() => handleNavigate('prev')} disabled={currentIndex <= 0} icon={<LeftOutlined />}>Bài trước</Button>
                <Button
                    type="primary"
                    onClick={() => handleNavigate('next')}
                    disabled={
                        currentIndex >= lessons.length - 1 ||
                        (!isLessonCompleted && currentLesson.contentType === 'video' && !hasWatchedEnough) ||
                        !isAuthenticated
                    }
                    icon={<RightOutlined />}
                >
                    Bài tiếp theo
                </Button>
            </div>
        </Card>
    );
};

export default LessonPage;
