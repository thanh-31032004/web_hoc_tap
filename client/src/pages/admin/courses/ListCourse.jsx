import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Container, Typography, Box, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
    fetchCourses,
    deleteCourse
} from '../../../features/course/courseSlide';

import ConfirmationDialog from '../../../components/ComfirmDialog';

function AdminCourseListPage() {
    const dispatch = useDispatch();
    const { list: courses, loading, error } = useSelector((state) => state.course || { list: [] });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (courseToDelete) {
            dispatch(deleteCourse(courseToDelete._id));
            setOpenDeleteDialog(false);
            setCourseToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setCourseToDelete(null);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Quản lý Khóa học</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/admin/courses/create"
                >
                    Tạo Khóa học mới
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && courses.length === 0 && !error && (
                <Typography>Chưa có khóa học nào được tạo.</Typography>
            )}

            {!loading && courses.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course._id}>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>
                                        {course.description
                                            ? `${course.description.slice(0, 50)}...`
                                            : '—'}
                                    </TableCell>
                                    <TableCell>{course.category || '—'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/admin/courses/edit/${course._id}`}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteClick(course)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa khóa học"
                message={`Bạn có chắc muốn xóa khóa học "${courseToDelete?.title || ''}"?`}
            />
        </Container>
    );
}

export default AdminCourseListPage;
