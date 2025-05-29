// client/src/components/layout/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';

function Footer() {
    return (
        <Box sx={{
            bgcolor: '#333', // Màu nền tối
            color: 'white',
            py: 3, // Padding top/bottom
            mt: 'auto', // Đẩy footer xuống cuối trang nếu nội dung ngắn
            textAlign: 'center',
        }}>
            <Container maxWidth="lg">
                <Typography variant="body1" sx={{ mb: 1 }}>
                    © {new Date().getFullYear()} Học Cùng AI. All rights reserved.
                </Typography>
                <Box sx={{ '& > *': { mx: 1 } }}> {/* Khoảng cách giữa các icon */}
                    <MuiLink href="https://github.com/your-github" color="inherit" target="_blank" rel="noopener">
                        <GitHubIcon />
                    </MuiLink>
                    <MuiLink href="https://linkedin.com/in/your-linkedin" color="inherit" target="_blank" rel="noopener">
                        <LinkedInIcon />
                    </MuiLink>
                    <MuiLink href="https://facebook.com/your-facebook" color="inherit" target="_blank" rel="noopener">
                        <FacebookIcon />
                    </MuiLink>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Được xây dựng với tình yêu và AI.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;