import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lessonApi from '../../../features/lesson/lessconApi';
import { updateLesson } from '../../../features/lesson/lessonSlide';
import { fetchCourses } from '../../../features/course/courseSlide';
import { useParams, useNavigate } from 'react-router-dom';

import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Typography,
} from '@mui/material';

const AdminLessonEditPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { list: courses, loading: loadingCourses } = useSelector((state) => state.course);

    useEffect(() => {
        // Lấy bài học theo id
        lessonApi.getById(id).then((res) => {
            const lesson = res.data;

            setFormData({
                ...lesson,
                course: typeof lesson.course === 'object' ? lesson.course._id : lesson.course || '',
            });
        });
    }, [id, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Submit data:', formData);
        await dispatch(updateLesson({ id, data: formData }));
        navigate('/admin/lessons');
    };

    if (!formData) return <p>Đang tải bài học...</p>;

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 600, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography variant="h5">Chỉnh sửa bài học</Typography>

            <TextField
                label="Tiêu đề"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
            />

            <FormControl fullWidth required>
                <InputLabel>Khóa học</InputLabel>
                <Select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    label="Khóa học"
                >
                    <MenuItem value="">-- Chọn khóa học --</MenuItem>
                    {loadingCourses ? (
                        <MenuItem disabled>Đang tải...</MenuItem>
                    ) : (
                        courses.map((c) => (
                            <MenuItem key={c._id} value={c._id}>
                                {c.title}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Loại nội dung</InputLabel>
                <Select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    label="Loại nội dung"
                >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="text">Văn bản</MenuItem>
                </Select>
            </FormControl>

            {formData.contentType === 'text' ? (
                <TextField
                    label="Nội dung văn bản"
                    name="contentText"
                    value={formData.contentText || ''}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
            ) : (
                <TextField
                    label="URL Video"
                    name="contentUrl"
                    value={formData.contentUrl || ''}
                    onChange={handleChange}
                />
            )}

            <TextField
                label="Thứ tự"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                inputProps={{ min: 1 }}
            />

            <TextField
                label="Thời lượng (phút)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{ min: 1 }}
            />

            <Button type="submit" variant="contained" color="primary">
                Cập nhật bài học
            </Button>
        </Box>
    );
};

export default AdminLessonEditPage;
