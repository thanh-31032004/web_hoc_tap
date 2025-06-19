import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { logout } from '../features/auth/authSlide';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleGoToProfile = () => {
        sessionStorage.setItem('profileReloaded', 'false');
        navigate('/profile');
        window.location.reload();
    };

    const renderAvatar = () => {
        if (user?.avatar) {
            return <Avatar alt={user.username} src={user.avatar} />;
        }

        const initial = user?.username?.[0]?.toUpperCase() || '?';
        return <Avatar>{initial}</Avatar>;
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2196f3', color: 'white' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 1 }} />
                        Học Cùng AI
                    </Link>
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/courses">Khóa học</Button>

                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/ai-roadmap">Lộ trình AI</Button>

                            {user?.role === 'admin' && (
                                <Button color="inherit" component={Link} to="/admin/dashboard">Admin</Button>
                            )}

                            <Tooltip title={user?.username || 'Người dùng'}>
                                <IconButton onClick={handleGoToProfile} color="inherit" sx={{ p: 0 }}>
                                    {renderAvatar()}
                                </IconButton>
                            </Tooltip>

                            <Button color="inherit" onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Đăng nhập</Button>
                            <Button color="inherit" component={Link} to="/register">Đăng ký</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
