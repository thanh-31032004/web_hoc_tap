import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ReactPlayer from 'react-player/youtube';
import axiosInstance from '../config/axios';

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [orderedLessons, setOrderedLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
    const [isLessonCompleted, setIsLessonCompleted] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = !!localStorage.getItem("token");

    const watchThreshold = 0.8;

    const fetchLessons = async () => {
        const res = await axiosInstance.get('/lessons');
        return res.data;
    };

    const fetchLessonStatus = async (lessonId) => {
        try {
            const res = await axiosInstance.get(`/progress/lessons/${lessonId}/status`);
            return res.data.isCompleted;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const markLessonAsCompleted = async (lessonId) => {
        try {
            await axiosInstance.post('/progress/lessons/complete', { lessonId });
            setIsLessonCompleted(true);
            console.log("Bài học đã được đánh dấu hoàn thành!");
        } catch (err) {
            console.error("Lỗi khi đánh dấu hoàn thành bài học:", err);
            alert(`Không thể đánh dấu hoàn thành: ${err.message}`);
        }
    };

    const updateCurrentLesson = async (courseId, lessonId) => {
        try {
            await axiosInstance.put('/progress/current-lesson', { courseId, lessonId });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const lessonsData = await fetchLessons();

                setLessons(lessonsData);

                const filtered = lessonsData
                    .filter(lesson => lesson.course === courseId || lesson.course?._id === courseId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                setOrderedLessons(filtered);

                const idx = filtered.findIndex(l => l._id === lessonId);
                setCurrentIndex(idx);
                const foundLesson = filtered[idx] || null;
                setCurrentLesson(foundLesson);

                if (foundLesson && isAuthenticated) {
                    const completed = await fetchLessonStatus(foundLesson._id);
                    setIsLessonCompleted(completed);

                    await updateCurrentLesson(courseId, foundLesson._id);
                }

                if (foundLesson && isAuthenticated) {
                    setHasWatchedEnough(false);
                }
            } catch (err) {
                console.error(err);
                setError(err.message || "Có lỗi xảy ra.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [courseId, lessonId, isAuthenticated]);

    const handleProgress = (state) => {
        if (currentLesson?.contentType === 'video' && isAuthenticated && !isLessonCompleted && !hasWatchedEnough) {
            if (state.played >= watchThreshold) {
                setHasWatchedEnough(true);
                console.log(`Đã xem đủ ${watchThreshold * 100}% video. Có thể đánh dấu hoàn thành.`);
            }
        }
    };

    const handleMarkAsCompleted = async () => {
        if (isAuthenticated && lessonId && !isLessonCompleted) {
            await markLessonAsCompleted(lessonId);
        }
    };

    const handleNavigate = (direction) => {
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < orderedLessons.length) {
            const nextLesson = orderedLessons[newIndex];
            navigate(`/courses/${courseId}/lessons/${nextLesson._id}`);
        }
    };

    const handleBackToCourse = () => {
        navigate(`/courses/${courseId}`);
    };

    if (loading || !currentLesson) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Đang tải bài học...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mx: 'auto', mt: 4, maxWidth: 'md' }}>
                Có lỗi khi tải dữ liệu: {error}. Vui lòng thử lại.
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/courses')}
                    sx={{ mt: 2 }}
                >
                    Về danh sách khóa học
                </Button>
            </Alert>
        );
    }

    if (!currentLesson) {
        return (
            <Alert severity="error" sx={{ mx: 'auto', mt: 4, maxWidth: 'md' }}>
                Không tìm thấy bài học với ID: {lessonId}. Vui lòng kiểm tra lại URL.
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/courses')}
                    sx={{ mt: 2 }}
                >
                    Về danh sách khóa học
                </Button>
            </Alert>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4, my: 4 }}>
            <Paper sx={{ p: 4 }} elevation={3}>
                <Button
                    variant="text"
                    onClick={handleBackToCourse}
                    startIcon={<NavigateBeforeIcon />}
                    sx={{ mb: 2 }}
                >
                    Quay lại Khóa học
                </Button>

                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {currentLesson.title}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    {isLessonCompleted ? (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Đã hoàn thành bài học này"
                            color="success"
                            variant="filled"
                            size="medium"
                        />
                    ) : (
                        isAuthenticated ? (
                            <Chip
                                icon={<PlayCircleIcon />}
                                label="Đang học..."
                                color="info"
                                variant="outlined"
                                size="medium"
                            />
                        ) : (
                            <Chip
                                label="Đăng nhập để lưu tiến độ"
                                color="warning"
                                variant="outlined"
                                size="medium"
                            />
                        )
                    )}
                </Box>

                <Box sx={{ my: 4, minHeight: '400px', bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden' }}>
                    {currentLesson.contentType === 'video' ? (
                        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                            <ReactPlayer
                                url={currentLesson.contentUrl}
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                                controls
                                onProgress={handleProgress}
                                playing={true}
                                progressInterval={500}
                            />
                        </Box>
                    ) : currentLesson.contentType === 'text' ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', p: 2 }}>
                            {currentLesson.contentText}
                        </Typography>
                    ) : (
                        <Alert severity="warning" sx={{ p: 2 }}>
                            Nội dung bài học không khả dụng hoặc định dạng không được hỗ trợ.
                        </Alert>
                    )}
                </Box>

                {isAuthenticated && !isLessonCompleted && (currentLesson.contentType === 'text' || hasWatchedEnough) && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleMarkAsCompleted}
                        sx={{ mt: 2 }}
                    >
                        Đánh dấu đã hoàn thành
                    </Button>
                )}
                {!isAuthenticated && (currentLesson.contentType === 'text' || hasWatchedEnough) && !isLessonCompleted && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Đăng nhập để có thể đánh dấu bài học đã hoàn thành.
                    </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleNavigate('prev')}
                        disabled={currentIndex <= 0}
                        startIcon={<NavigateBeforeIcon />}
                    >
                        Bài trước
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleNavigate('next')}
                        disabled={
                            currentIndex >= orderedLessons.length - 1 ||
                            (!isLessonCompleted && currentLesson.contentType === 'video' && !hasWatchedEnough) ||
                            !isAuthenticated
                        }
                        endIcon={<NavigateNextIcon />}
                    >
                        Bài tiếp theo
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LessonPage;
