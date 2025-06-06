import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, TextField, Button, Box, Paper, Alert, MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../../features/course/courseSlide';
import { useNavigate } from 'react-router-dom';

const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Game Development'
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

function AdminCourseCreatePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector((state) => state.course);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const result = await dispatch(createCourse(data));
        if (createCourse.fulfilled.match(result)) {
            navigate('/admin/courses');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Tạo Khóa học mới
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Tiêu đề */}
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        margin="normal"
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
                        {...register('description', { required: 'Mô tả là bắt buộc' })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    {/* Thumbnail (tùy chọn) */}
                    <TextField
                        fullWidth
                        label="Thumbnail (URL)"
                        margin="normal"
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
                        defaultValue=""
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
                        defaultValue="Beginner"
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
                            Tạo
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminCourseCreatePage;
