import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Box,
    Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { logout } from '../features/auth/authSlide';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleGoToProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login');
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
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <SchoolIcon sx={{ mr: 1 }} />
                        Học Cùng AI
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/ai-roadmap">Lộ trình AI</Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {!isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Đăng nhập
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Đăng ký
                            </Button>
                        </>
                    ) : (
                        <>
                            <Tooltip title={user?.username || 'Tài khoản'}>
                                <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0 }}>
                                    {renderAvatar()}
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={handleGoToProfile}>
                                    Thông tin cá nhân
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
