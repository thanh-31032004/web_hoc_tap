import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons } from '../features/lesson/lessonSlide';
import { fetchCourses } from '../features/course/courseSlide';
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
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { list: lessons } = useSelector((state) => state.lesson);
    const { list: courses } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(fetchLessons());
        dispatch(fetchCourses());
    }, [dispatch]);

    const course = courses.find((c) => c._id === id);

    const filteredLessons = lessons
        .filter((lesson) => lesson.course === id || lesson.course?._id === id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const handleStart = () => {
        if (filteredLessons.length > 0) {
            navigate(`/lessons/${filteredLessons[0]._id}`);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: '1600px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Phần thông tin khóa học */}
                <Paper sx={{ flex: 2, p: 3 }} elevation={3}>
                    <Typography variant="h4" gutterBottom>
                        {course?.title || 'Khóa học'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {course?.description || 'Không có mô tả cho khóa học này.'}
                    </Typography>


                </Paper>

                {/* Danh sách bài học */}
                <Paper sx={{ flex: 2, p: 3 }} elevation={3}>
                    <Typography variant="h5" gutterBottom>
                        Danh sách bài học
                    </Typography>

                    {filteredLessons.length === 0 ? (
                        <Typography color="text.secondary">
                            Không có bài học nào trong khóa học này.
                        </Typography>
                    ) : (
                        <List>
                            {filteredLessons.map((lesson, index) => (
                                <Box key={lesson._id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PlayCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${index + 1}. ${lesson.title}`}
                                            secondary={`Loại: ${lesson.contentType} - Thời lượng: ${lesson.duration || 0} phút`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </Box>
                            ))}
                        </List>
                    )}
                    {filteredLessons.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, float: 'right' }}
                            onClick={handleStart}
                        >
                            Bắt đầu học
                        </Button>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default CourseDetailPage;
