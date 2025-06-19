import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../features/course/courseSlide';
import {
    fetchCourseProgress,
    fetchCurrentLesson
} from '../features/userProgress/userProgressSlice';
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
    LinearProgress,
    Stack,
    Paper,
    Alert
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { currentLesson, loading, courseProgress, error } = useSelector((state) => state.userProgress);
    const courses = useSelector((state) => state.course.list);

    // Lấy dữ liệu bài học và khóa học hiện tại
    const lastAccessedData = currentLesson?.lastAccessedLesson;
    const lessonData = lastAccessedData?.lesson;
    const courseId = lessonData?.course || null;

    // Tìm khóa học tương ứng trong danh sách
    const course = courses.find(c => c._id === courseId);
    const courseTitle = course?.title || `Khóa học`;

    // Lấy thông tin tiến độ của khóa học đó
    // GHI CHÚ: Giả sử courseProgress[courseId] trả về object có dạng { completedLessons, totalLessons }
    const progressInfo = courseProgress?.[courseId] || { completedLessons: 0, totalLessons: 0 };
    const completionPercentage = progressInfo.totalLessons > 0
        ? (progressInfo.completedLessons / progressInfo.totalLessons) * 100
        : 0;

    // Fetch dữ liệu cần thiết
    useEffect(() => {
        if (!currentLesson && isAuthenticated) {
            dispatch(fetchCurrentLesson());
        }
        if (courses.length === 0) {
            dispatch(fetchCourses());
        }
        // Chỉ fetch progress nếu chưa có trong state
        if (isAuthenticated && courseId && !courseProgress[courseId]) {
            dispatch(fetchCourseProgress(courseId));
        }
    }, [dispatch, isAuthenticated, currentLesson, courseId, courses.length, courseProgress]);

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Alert severity="error">Vui lòng đăng nhập để xem trang cá nhân.</Alert>
            </Box>
        );
    }

    // ---- Render Functions để code gọn gàng hơn ----

    const renderUserInfo = () => (
        <Card elevation={4} sx={{ height: '100%' }}>
            <CardContent>
                <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: deepOrange[500], width: 80, height: 80, fontSize: '2.5rem' }}>
                        {user?.username ? user.username.charAt(0).toUpperCase() : <PersonIcon />}
                    </Avatar>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        {user?.username || 'Học viên'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {user?.email || 'Không có email'}
                    </Typography>
                    <Button variant="outlined" size="small" onClick={() => navigate('/settings/profile')}>
                        Chỉnh sửa hồ sơ
                    </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1.5}>
                    <Typography><strong>Trình độ:</strong> {user?.skillLevel || 'Chưa cập nhật'}</Typography>
                    <Typography><strong>Mục tiêu:</strong> {user?.learningGoals || 'Chưa cập nhật'}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );

    const renderLearningProgress = () => {
        if (loading && !lessonData) {
            return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
        }

        if (error) {
            return <Alert severity="warning">Không thể tải được tiến độ học tập. Vui lòng thử lại.</Alert>;
        }

        if (!lessonData) {
            return (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>Chào mừng bạn quay trở lại!</Typography>
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
            );
        }

        return (
            <Card elevation={4}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="div" fontWeight="medium" gutterBottom>
                        Tiếp tục học
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <SchoolIcon color="primary" />
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                            {courseTitle}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Bài học gần nhất: <strong>{lessonData.title}</strong>
                    </Typography>
                    <Divider sx={{ my: 2.5 }} />

                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/courses/${courseId}/lessons/${lessonData._id}`)}
                    >
                        Vào học ngay
                    </Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1a237e' }}>
                Tổng quan học tập
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    {renderUserInfo()}
                </Grid>
                <Grid item xs={12} md={8}>
                    {renderLearningProgress()}
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProfilePage;