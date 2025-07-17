import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    CircularProgress,
    Paper,
    Alert,
    Snackbar,
    Card,
    CardContent,
    CardMedia,
    Link
} from '@mui/material';
import { marked } from 'marked';
import axiosInstance from '../config/axios';

const AILearningPath = () => {
    const [formData, setFormData] = useState({
        level: 'beginner',
        goal: '',
        freeHours: 1,
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedCourses, setSuggestedCourses] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setSuggestedCourses([]);

        try {
            const response = await axiosInstance.post('/api/ai/learning-path', formData);
            setResult(response.data.path);

            const extractedCourses = extractCoursesFromMarkdown(response.data.path);
            setSuggestedCourses(extractedCourses);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    const extractCoursesFromMarkdown = (markdown) => {
        const courses = [];
        const regex = /\[([^\]]+)\]\(\/courses\/([a-f\d]{24})\)/gi;
        let match;

        while ((match = regex.exec(markdown)) !== null) {
            const title = match[1];
            const courseId = match[2];
            courses.push({
                title,
                url: `/courses/${courseId}`,
            });
        }

        return courses;
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tạo Lộ Trình Học Tập AI
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Trình độ"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="beginner">Mới bắt đầu</option>
                                    <option value="intermediate">Trung cấp</option>
                                    <option value="advanced">Nâng cao</option>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mục tiêu học tập"
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Trở thành Full-stack Developer"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Thời gian học mỗi ngày (giờ)"
                                    name="freeHours"
                                    type="number"
                                    inputProps={{ min: 0.5, max: 24, step: 0.5 }}
                                    value={formData.freeHours}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Tạo Lộ Trình Học Tập'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                {suggestedCourses.length > 0 && (
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Khóa Học Được Gợi Ý
                        </Typography>
                        <Grid container spacing={2}>
                            {suggestedCourses.map((course, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                pt: '56.25%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                color: '#1976d2',
                                            }}
                                        >
                                            {course.title.charAt(0)}
                                        </CardMedia>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {course.title}
                                            </Typography>
                                            <Link href={course.url}>
                                                Xem khóa học
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {result && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Lộ Trình Học Tập Của Bạn
                        </Typography>
                        <Box
                            sx={{
                                '& h2': { fontSize: '1.5rem', fontWeight: 'bold', mt: 2, mb: 1 },
                                '& h3': { fontSize: '1.3rem', fontWeight: 'bold', mt: 2, mb: 1 },
                                '& ul': { pl: 3, mb: 2 },
                                '& li': { mb: 1 },
                                '& a': { color: '#1976d2', textDecoration: 'underline' }
                            }}
                            dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                        />
                    </Paper>
                )}

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default AILearningPath;
