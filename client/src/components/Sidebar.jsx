// client/src/components/layout/AdminSidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Icon cho nút đăng xuất
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 240; // Chiều rộng của Sidebar

function AdminSidebar() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Chuyển hướng cứng về trang đăng nhập và refresh
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#333', // Nền Sidebar tối
                    color: 'white', // Màu chữ sáng
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'white' }}>
                        Admin Panel
                    </Link>
                </Typography>
            </Toolbar>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} /> {/* Divider màu sáng hơn */}
            <List>
                {/* Dashboard */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin">
                        <DashboardIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                {/* Quản lý Khóa học */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/courses">
                        <SchoolIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <ListItemText primary="Quản lý Khóa học" />
                    </ListItemButton>
                </ListItem>

                {/* Quản lý Bài học */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/lessons">
                        <BookIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <ListItemText primary="Quản lý Bài học" />
                    </ListItemButton>
                </ListItem>

                {/* Quản lý Người dùng */}
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/users">
                        <PeopleIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <ListItemText primary="Quản lý Người dùng" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

            {/* Nút Đăng xuất ở cuối Sidebar */}
            <Box sx={{ mt: 'auto', mb: 2 }}> {/* Đẩy xuống cuối */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/profile">
                            <PersonIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                            <ListItemText primary="Trang cá nhân" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ExitToAppIcon sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
                            <ListItemText primary="Đăng xuất" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}

export default AdminSidebar;