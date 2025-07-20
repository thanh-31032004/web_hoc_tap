// client/src/components/layout/Layout.jsx
import React from 'react';
import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer
import { Box, CssBaseline } from '@mui/material'; // CssBaseline để reset CSS cơ bản
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Layout = () => {
    return (

        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <CssBaseline />
            <Header />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;