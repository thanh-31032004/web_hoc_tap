import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLesson } from '../../../features/lesson/lessonSlide';
import { fetchCourses } from '../../../features/course/courseSlide';
import { useNavigate } from 'react-router-dom';

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
import { toast } from 'react-toastify';

const AdminLessonAddPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: '',
        contentType: 'video',
        contentUrl: '',
        contentText: '',
        order: 1,
        duration: 10,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list: courses, loading: loadingCourses } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createLesson(formData));
        toast.success("Thêm bài học thành công!");
        navigate('/admin/lessons');
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 600, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography variant="h5">Thêm bài học</Typography>

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
                    value={
                        courses.find(c => c._id === formData.course) ? formData.course : ''
                    }
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
                    value={formData.contentText}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
            ) : (
                <TextField
                    label="URL Video"
                    name="contentUrl"
                    value={formData.contentUrl}
                    onChange={handleChange}
                />
            )}

            <TextField
                label="Thứ tự"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}

            />

            <TextField
                label="Thời lượng (phút)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}

            />

            <Button type="submit" variant="contained" color="primary">
                Lưu bài học
            </Button>
        </Box>
    );
};

export default AdminLessonAddPage;
