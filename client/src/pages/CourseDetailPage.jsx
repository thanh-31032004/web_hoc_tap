import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Import Redux actions
import { fetchLessons } from '../features/lesson/lessonSlide';
import { fetchCourses } from '../features/course/courseSlide';

// Import MUI components
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    Divider,
    Paper,
    CircularProgress, // Thêm CircularProgress để hiển thị loading
    Alert, // Thêm Alert để hiển thị lỗi
    // Thêm Accordion, AccordionSummary, AccordionDetails nếu muốn hiển thị dạng mở/gập
    Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';

// Import Icons
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SchoolIcon from '@mui/icons-material/School'; // Icon cho tiêu đề khóa học
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // Icon cho nút bắt đầu học
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon cho Accordion

const CourseDetailPage = () => {
    const { id } = useParams(); // Lấy ID khóa học từ URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy state từ Redux store
    const { list: lessons, loading: lessonsLoading, error: lessonsError } = useSelector((state) => state.lesson);
    const { list: courses, loading: coursesLoading, error: coursesError } = useSelector((state) => state.course);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        // Chỉ fetch nếu danh sách trống hoặc bạn muốn đảm bảo dữ liệu luôn mới
        // Tuy nhiên, việc fetch tất cả lessons/courses trên mỗi trang chi tiết có thể không tối ưu.
        // Lý tưởng là Redux store đã có dữ liệu này từ trang list, hoặc bạn chỉ fetch course chi tiết.
        // Nếu bạn muốn fetch riêng, thì nên dùng axios trực tiếp như ví dụ trước thay vì Redux.
        // Ở đây, tôi giữ nguyên logic fetch từ Redux để phù hợp với yêu cầu của bạn.
        if (lessons.length === 0 && !lessonsLoading && !lessonsError) {
            dispatch(fetchLessons());
        }
        if (courses.length === 0 && !coursesLoading && !coursesError) {
            dispatch(fetchCourses());
        }
    }, [dispatch, lessons.length, courses.length, lessonsLoading, coursesLoading, lessonsError, coursesError]);

    // Tìm khóa học hiện tại từ danh sách courses trong Redux store
    const course = courses.find((c) => c._id === id);

    // Lọc và sắp xếp các bài học thuộc về khóa học này
    // Sử dụng `.filter` và `.sort` trên mảng `lessons` từ Redux
    const filteredLessons = lessons
        .filter((lesson) => lesson.course === id || lesson.course?._id === id) // `lesson.course` có thể là ID hoặc object đã populate
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sắp xếp theo thứ tự

    // Hàm xử lý khi nhấn nút "Bắt đầu học"
    const handleStartCourse = () => {
        if (filteredLessons.length > 0) {
            const firstLesson = filteredLessons[0]; // Bài học đầu tiên sau khi đã sắp xếp
            navigate(`/courses/${course._id}/lessons/${firstLesson._id}`); // Điều hướng đến LessonPage
        } else {
            // Có thể hiển thị thông báo lỗi hoặc không làm gì nếu không có bài học
            console.warn('Khóa học này chưa có bài học nào để bắt đầu.');
        }
    };

    // Hiển thị trạng thái tải
    if (coursesLoading || lessonsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Hiển thị lỗi
    if (coursesError || lessonsError || !course) { // Thêm !course để kiểm tra nếu không tìm thấy khóa học
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{coursesError || lessonsError || 'Không tìm thấy khóa học hoặc có lỗi xảy ra.'}</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: '1600px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Phần thông tin khóa học */}
                <Paper sx={{ flex: 2, p: 3 }} elevation={3}>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            {course.title}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        {course.description || 'Không có mô tả cho khóa học này.'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        **Danh mục:** {course.category || 'Không xác định'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        **Thời lượng:** {course.duration || 'Không xác định'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        **Giá:** {course.price === 0 ? 'Miễn phí' : `${course.price?.toLocaleString()} VNĐ`}
                    </Typography>

                    {/* Nút "Bắt đầu học" */}
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<PlayCircleOutlineIcon />}
                        onClick={handleStartCourse} // Gắn hàm xử lý vào đây
                        disabled={filteredLessons.length === 0} // Vô hiệu hóa nếu không có bài học
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {filteredLessons.length > 0 ? 'Bắt đầu học' : 'Chưa có bài học'}
                    </Button>
                </Paper>

                {/* Danh sách bài học */}
                <Paper sx={{ flex: 2, p: 3 }} elevation={3}>
                    <Typography variant="h5" gutterBottom>
                        Nội dung khóa học
                    </Typography>

                    {filteredLessons.length === 0 ? (
                        <Typography color="text.secondary">
                            Không có bài học nào trong khóa học này.
                        </Typography>
                    ) : (
                        <List>
                            {filteredLessons.map((lesson, index) => (
                                <Accordion key={lesson._id} disableGutters elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`lesson-panel-${lesson._id}-content`}
                                        id={`lesson-panel-${lesson._id}-header`}
                                    >
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 35 }}>
                                                <PlayCircleIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${index + 1}. ${lesson.title}`}
                                                secondary={`Loại: ${lesson.contentType} - Thời lượng: ${lesson.duration || 0} phút`}
                                            />
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" paragraph>
                                            {lesson.description}
                                        </Typography>
                                        <Button
                                            component={RouterLink}
                                            to={`/courses/${course._id}/lessons/${lesson._id}`}
                                            variant="contained"
                                            size="small"
                                            sx={{ mt: 2 }}
                                        >
                                            Xem chi tiết bài học
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default CourseDetailPage;