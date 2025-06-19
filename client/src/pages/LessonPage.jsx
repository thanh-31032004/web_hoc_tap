import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLessons } from '../features/lesson/lessonSlide';
import {
    fetchLessonStatus,
    markLessonAsCompleted, // Import markLessonAsCompleted
    updateCurrentLesson
} from '../features/userProgress/userProgressSlice';

import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Chip // Thêm Chip để hiển thị trạng thái
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle'; // Icon cho trạng thái đang học
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Icon cho loading
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home'; // Để về trang chủ hoặc danh sách khóa học
import ReactPlayer from 'react-player/youtube';

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const lessons = useSelector(state => state.lesson.list);
    const lessonsLoading = useSelector(state => state.lesson.loading); // Đổi tên để rõ ràng hơn
    const lessonsError = useSelector(state => state.lesson.error); // Lấy lỗi từ lessonSlide

    const {
        completedLessons,
        loading: userProgressLoading, // Đổi tên để rõ ràng hơn
        error: userProgressError // Đổi tên để rõ ràng hơn
    } = useSelector(state => state.userProgress);

    const [orderedLessons, setOrderedLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [hasWatchedEnough, setHasWatchedEnough] = useState(false); // Theo dõi tiến độ xem video

    const watchThreshold = 0.8; // Ngưỡng xem video (80%)

    // Effect 1: Fetch tất cả bài học nếu chưa có
    useEffect(() => {
        if (lessons.length === 0 && !lessonsLoading && !lessonsError) {
            dispatch(fetchLessons());
        }
    }, [dispatch, lessons.length, lessonsLoading, lessonsError]);

    // Effect 2: Tìm bài học hiện tại, lọc/sắp xếp bài học trong khóa và cập nhật index
    useEffect(() => {
        if (lessons.length > 0 && lessonId) {
            const filtered = lessons
                .filter(lesson => lesson.course === courseId || lesson.course?._id === courseId)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            setOrderedLessons(filtered);

            const idx = filtered.findIndex(l => l._id === lessonId);
            setCurrentIndex(idx);
            const foundLesson = filtered[idx] || null;
            setCurrentLesson(foundLesson);

            // Reset hasWatchedEnough khi chuyển bài
            if (foundLesson) {
                setHasWatchedEnough(completedLessons.includes(foundLesson._id));
            }
        }
    }, [lessons, courseId, lessonId, completedLessons]); // Thêm completedLessons vào dependencies để cập nhật hasWatchedEnough

    // Effect 3: Fetch trạng thái hoàn thành và cập nhật bài học gần đây nhất
    useEffect(() => {
        if (isAuthenticated && lessonId && courseId && currentLesson) { // Đảm bảo currentLesson đã có
            dispatch(fetchLessonStatus(lessonId));
            // updateCurrentLesson chỉ gọi một lần khi lessonId thay đổi
            dispatch(updateCurrentLesson({ courseId, lessonId }));
        }
    }, [dispatch, isAuthenticated, courseId, lessonId, currentLesson]); // Thêm currentLesson vào dependencies

    const isLessonCompleted = useMemo(
        () => completedLessons.includes(lessonId),
        [completedLessons, lessonId]
    );

    const handleProgress = (state) => {
        // Chỉ xử lý nếu là video, người dùng đã đăng nhập, bài chưa hoàn thành và chưa xem đủ
        if (currentLesson?.contentType === 'video' && isAuthenticated && !isLessonCompleted && !hasWatchedEnough) {
            if (state.played >= watchThreshold) {
                setHasWatchedEnough(true);
                // Bạn có thể dispatch markLessonAsCompleted ở đây hoặc yêu cầu người dùng nhấn nút
                console.log(`Đã xem đủ ${watchThreshold * 100}% video. Có thể đánh dấu hoàn thành.`);
            }
        }
    };

    const handleMarkAsCompleted = () => {
        if (isAuthenticated && lessonId && !isLessonCompleted) {
            dispatch(markLessonAsCompleted(lessonId))
                .unwrap()
                .then(() => {
                    console.log("Bài học đã được đánh dấu hoàn thành!");
                    // isLessonCompleted sẽ tự cập nhật nhờ Redux state thay đổi
                })
                .catch(err => {
                    console.error("Lỗi khi đánh dấu hoàn thành bài học:", err);
                    alert(`Không thể đánh dấu hoàn thành: ${err}`);
                });
        }
    };

    const handleNavigate = (direction) => {
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < orderedLessons.length) {
            const nextLesson = orderedLessons[newIndex];
            // Chỉ navigate, updateCurrentLesson sẽ được xử lý bởi useEffect khi URL thay đổi
            navigate(`/courses/${courseId}/lessons/${nextLesson._id}`);
        }
    };

    const handleBackToCourse = () => {
        navigate(`/courses/${courseId}`);
    };

    const overallLoading = lessonsLoading || userProgressLoading;
    const overallError = lessonsError || userProgressError;

    if (overallLoading || !currentLesson) { // `!currentLesson` sẽ đúng khi đang fetch hoặc không tìm thấy
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Đang tải bài học...</Typography>
            </Box>
        );
    }

    if (overallError) {
        return (
            <Alert severity="error" sx={{ mx: 'auto', mt: 4, maxWidth: 'md' }}>
                Có lỗi khi tải dữ liệu: {overallError}. Vui lòng thử lại.
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

    if (!currentLesson) { // Trường hợp lessonId không hợp lệ sau khi load xong
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
                                onProgress={handleProgress} // Theo dõi tiến độ xem
                                playing={true} // Tự động phát khi tải trang
                                progressInterval={500} // Cập nhật progress mỗi 0.5 giây
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

                {/* Nút đánh dấu hoàn thành */}
                {isAuthenticated && !isLessonCompleted && (currentLesson.contentType === 'text' || hasWatchedEnough) && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleMarkAsCompleted}
                        disabled={userProgressLoading} // Disable khi đang gửi yêu cầu
                        sx={{ mt: 2 }}
                    >
                        {userProgressLoading ? <CircularProgress size={24} color="inherit" /> : 'Đánh dấu đã hoàn thành'}
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
                        // Disable nút "Bài tiếp theo" nếu chưa xem đủ video (nếu là video) hoặc chưa đăng nhập
                        disabled={
                            currentIndex >= orderedLessons.length - 1 ||
                            (!isLessonCompleted && currentLesson.contentType === 'video' && !hasWatchedEnough) ||
                            !isAuthenticated // Thêm điều kiện này nếu bạn muốn người dùng phải đăng nhập mới được chuyển bài
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