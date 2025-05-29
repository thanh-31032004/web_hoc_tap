// client/src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;

    if (userString) {
        try {
            user = JSON.parse(userString);
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            // Optionally, clear the corrupted item or handle the error
            // localStorage.removeItem('user'); // Or redirect to login
        }
    }

    const isAuthenticated = !!token && !!user;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload(); // Consider if a state update is better than reload
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 1 }} />
                        Học Cùng AI
                    </Link>
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Button color="inherit" component={Link} to="/courses">Khóa học</Button>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/ai-roadmap">Lộ trình AI</Button>
                            {user && user.role === 'admin' && (
                                <Button color="inherit" component={Link} to="/admin/dashboard">Admin</Button>
                            )}
                            <Button color="inherit" component={Link} to="/profile">Profile ({user?.username || 'User'})</Button> {/* Added fallback for username */}
                            <Button color="inherit" onClick={handleLogout}>Đăng xuất</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Đăng nhập</Button>
                            {/* Consistent Button styling for Register */}
                            <Button color="inherit" component={Link} to="/register">Đăng ký</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;