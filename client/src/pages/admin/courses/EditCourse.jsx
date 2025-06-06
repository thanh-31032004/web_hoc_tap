import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, TextField, Button, Box, Paper, Alert, MenuItem, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCourse, fetchCourses } from '../../../features/course/courseSlide';

const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Game Development'
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

function AdminCourseEditPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { list, loading, error } = useSelector((state) => state.course);
    const course = list.find(c => c._id === id);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();

    // Fetch data if not loaded
    useEffect(() => {
        if (!course && !loading) {
            dispatch(fetchCourses());
        }
    }, [course, dispatch, loading]);

    // Reset form with course data
    useEffect(() => {
        if (course) {
            reset({
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                category: course.category,
                difficulty: course.difficulty || 'Beginner',
            });
        }
    }, [course, reset]);

    const onSubmit = async (data) => {
        const result = await dispatch(updateCourse({ id, data }));
        if (updateCourse.fulfilled.match(result)) {
            navigate('/admin/courses');
        }
    };

    if (loading || !course) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Cập nhật Khóa học
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Tiêu đề */}
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        margin="normal"
                        defaultValue={course?.title}
                        {...register('title', { required: 'Tiêu đề là bắt buộc' })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    {/* Mô tả */}
                    <TextField
                        fullWidth
                        label="Mô tả"
                        margin="normal"
                        multiline
                        rows={4}
                        defaultValue={course?.description}
                        {...register('description', { required: 'Mô tả là bắt buộc' })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    {/* Thumbnail */}
                    <TextField
                        fullWidth
                        label="Thumbnail (URL)"
                        margin="normal"
                        defaultValue={course?.thumbnail}
                        {...register('thumbnail', { required: 'Ảnh đại diện là bắt buộc' })}
                        error={!!errors.thumbnail}
                        helperText={errors.thumbnail?.message}
                    />

                    {/* Danh mục */}
                    <TextField
                        fullWidth
                        select
                        label="Danh mục"
                        margin="normal"
                        defaultValue={course?.category}
                        {...register('category', { required: 'Danh mục là bắt buộc' })}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Độ khó */}
                    <TextField
                        fullWidth
                        select
                        label="Độ khó"
                        margin="normal"
                        defaultValue={course?.difficulty || 'Beginner'}
                        {...register('difficulty')}
                    >
                        {difficulties.map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box mt={2}>
                        <Button type="submit" variant="contained" fullWidth>
                            Cập nhật
                        </Button>
                    </Box>
                </Box>

            </Paper>
        </Container>
    );
}

export default AdminCourseEditPage;
