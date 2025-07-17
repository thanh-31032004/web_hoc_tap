import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import axiosInstance from '../../../config/axios';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('auth/users');
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá người dùng này?')) {
            try {
                await axiosInstance.delete(`auth/users/${id}`);
                setUsers(prev => prev.filter(user => user._id !== id));
                setFilteredUsers(prev => prev.filter(user => user._id !== id));
                setSnackbar({ type: 'success', message: 'Xoá người dùng thành công' });
            } catch (err) {
                setSnackbar({ type: 'error', message: err.response?.data?.message || 'Lỗi khi xoá người dùng' });
            }
        }
    };

    const handleToggleAdmin = async (user) => {
        const newRole = user.role === 'admin' ? 'student' : 'admin';
        try {
            await axiosInstance.put(`auth/users/${user._id}`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            setFilteredUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            setSnackbar({ type: 'success', message: `Đã đổi quyền thành ${newRole}` });
        } catch (err) {
            setSnackbar({ type: 'error', message: err.response?.data?.message || 'Lỗi khi đổi quyền' });
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = users.filter(
            (user) =>
                user.username?.toLowerCase().includes(value) ||
                user.email?.toLowerCase().includes(value)
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý người dùng
            </Typography>

            <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={handleSearch}
                sx={{ mb: 2 }}
            />

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên người dùng</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Quyền</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={user.role === 'admin' ? 'Bỏ quyền Admin' : 'Cấp quyền Admin'}>
                                            <IconButton
                                                color={user.role === 'admin' ? 'warning' : 'primary'}
                                                onClick={() => handleToggleAdmin(user)}
                                            >
                                                {user.role === 'admin' ? <PersonIcon /> : <AdminPanelSettingsIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton color="error" onClick={() => handleDelete(user._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Không tìm thấy người dùng nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={!!snackbar}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
            >
                {snackbar && (
                    <Alert severity={snackbar.type} onClose={() => setSnackbar(null)}>
                        {snackbar.message}
                    </Alert>
                )}
            </Snackbar>
        </Container>
    );
};

export default UserListPage;
