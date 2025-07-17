import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axios';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Button,
    Grid,
    Avatar,
    Stack,
    Paper,
    Alert,
    LinearProgress,
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [progressAll, setProgressAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    const fetchData = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);

            // Lấy danh sách courses
            const resCourses = await axiosInstance.get('/courses');
            setCourses(resCourses.data);

            // Lấy progress tất cả khóa học
            const resProgress = await axiosInstance.get('/progress/all');
            const merged = mergeProgressData(resProgress.data);
            setProgressAll(merged);
            console.log('✅ Merged Progress:', merged);

        } catch (err) {
            console.error(err);
            setError('Không thể tải dữ liệu hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm merge progress trùng courseId
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
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Alert severity="error">Vui lòng đăng nhập để xem trang cá nhân.</Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1a237e' }}>
                Tổng quan học tập
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card elevation={4}>
                        <CardContent>
                            <Stack spacing={2} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: deepOrange[500],
                                        width: 80,
                                        height: 80,
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    {user?.username
                                        ? user.username.charAt(0).toUpperCase()
                                        : <PersonIcon />}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    {user?.username || 'Học viên'}
                                </Typography>
                                <Typography color="text.secondary">
                                    {user?.email || 'Không có email'}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate('/settings/profile')}
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>

                                {user?.role === 'admin' && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => navigate('/admin')}
                                    >
                                        Đến trang Admin
                                    </Button>
                                )}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                        </CardContent>

                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    {progressAll.filter(p => p.progressPercentage > 0).length === 0 ? (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Chào mừng bạn quay trở lại!
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Bạn chưa bắt đầu học khóa nào cả. Hãy khám phá các khóa học của chúng tôi nhé!
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<BookIcon />}
                                onClick={() => navigate('/courses')}
                            >
                                Khám phá khóa học
                            </Button>
                        </Paper>
                    ) : (
                        progressAll
                            .filter(p => p.progressPercentage > 0)
                            .map(progress => {
                                const course = courses.find(c => c._id === progress.courseId);
                                const courseTitle = course?.title || 'Khóa học';
                                const completedCount = progress.completedLessons.length;
                                const totalLessons = progress.totalLessons || 0;
                                const percentage =
                                    totalLessons > 0
                                        ? (completedCount / totalLessons) * 100
                                        : 0;
                                const lastLessonTitle = progress.lastAccessedLesson?.lesson?.title || 'Chưa có bài học gần nhất';
                                const lastLessonId = progress.lastAccessedLesson?.lesson?._id;

                                return (
                                    <Card key={progress.courseId} elevation={4} sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="medium" gutterBottom>
                                                Tiến độ học tập
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                                <SchoolIcon color="primary" />
                                                <Typography
                                                    variant="h5"
                                                    fontWeight="bold"
                                                    color="primary.main"
                                                >
                                                    {courseTitle}
                                                </Typography>
                                            </Stack>

                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                Bài học gần nhất: <strong>{lastLessonTitle}</strong>
                                            </Typography>

                                            <LinearProgress
                                                variant="determinate"
                                                value={percentage}
                                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {completedCount}/{totalLessons} bài học ({Math.round(percentage)}%)
                                            </Typography>

                                            <Divider sx={{ my: 2 }} />

                                            <Button
                                                variant="contained"
                                                size="large"
                                                endIcon={<ArrowForwardIcon />}
                                                disabled={!lastLessonId}
                                                onClick={() =>
                                                    navigate(`/courses/${progress.courseId}/lessons/${lastLessonId}`)
                                                }
                                            >
                                                Vào học ngay
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
