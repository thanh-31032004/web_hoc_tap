import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons, deleteLesson } from '../../../features/lesson/lessonSlide';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Button,
    CircularProgress,
} from '@mui/material';

const AdminLessonListPage = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.lesson);

    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Xác nhận xóa bài học?')) {
            dispatch(deleteLesson(id));
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Danh sách bài học
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Button variant="contained" color="primary" component={Link} to="/admin/lessons/create">
                    Thêm bài học
                </Button>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Khóa học</TableCell>
                                <TableCell>Loại nội dung</TableCell>
                                <TableCell>Nội dung</TableCell>
                                <TableCell>Thứ tự</TableCell>
                                <TableCell>Thời lượng (phút)</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((lesson) => (
                                <TableRow key={lesson._id}>
                                    <TableCell>{lesson.title}</TableCell>
                                    <TableCell>  {lesson.description.length > 100
                                        ? `${lesson.description.slice(0, 20)}...`
                                        : lesson.description}</TableCell>
                                    <TableCell>
                                        {typeof lesson.course === 'object'
                                            ? lesson.course.title
                                            : lesson.course}
                                    </TableCell>
                                    <TableCell>{lesson.contentType}</TableCell>
                                    <TableCell>
                                        {lesson.contentType === 'text'
                                            ? lesson.contentText?.slice(0, 50) + '...'
                                            : lesson.contentUrl}
                                    </TableCell>
                                    <TableCell>{lesson.order}</TableCell>
                                    <TableCell>{lesson.duration}</TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/admin/lessons/edit/${lesson._id}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(lesson._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminLessonListPage;
