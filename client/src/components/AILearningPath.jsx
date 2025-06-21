import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Chip,
    CircularProgress,
    Paper,
    Alert,
    Snackbar,
    Card,
    CardContent,
    CardMedia,
    Link
} from '@mui/material';
import axios from 'axios';
import { marked } from 'marked'; // Thêm thư viện để parse markdown

const AILearningPath = () => {
    const [formData, setFormData] = useState({
        level: 'beginner',
        goal: '',
        freeHours: 1,
        existingSkills: [],
        interests: [],
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [currentInterest, setCurrentInterest] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedCourses, setSuggestedCourses] = useState([]); // State mới cho khóa học được gợi ý

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillAdd = () => {
        if (currentSkill.trim() && !formData.existingSkills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                existingSkills: [...prev.existingSkills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleInterestAdd = () => {
        if (currentInterest.trim() && !formData.interests.includes(currentInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, currentInterest.trim()]
            }));
            setCurrentInterest('');
        }
    };

    const handleSkillDelete = (skillToDelete) => () => {
        setFormData(prev => ({
            ...prev,
            existingSkills: prev.existingSkills.filter(skill => skill !== skillToDelete)
        }));
    };

    const handleInterestDelete = (interestToDelete) => () => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(interest => interest !== interestToDelete)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setSuggestedCourses([]); // Reset khóa học gợi ý

        try {
            const response = await axios.post('http://localhost:5000/api/ai/learning-path', formData);
            setResult(response.data.path);

            // Trích xuất các khóa học từ kết quả
            const extractedCourses = extractCoursesFromMarkdown(response.data.path);
            setSuggestedCourses(extractedCourses);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    // Hàm trích xuất khóa học từ nội dung markdown
    const extractCoursesFromMarkdown = (markdown) => {
        const courses = [];

        // Regex để tìm các liên kết trong markdown
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkRegex.exec(markdown)) !== null) {
            const title = match[1];
            const url = match[2];
            const thumbnail = match[3] || ''; // Nếu có thumbnail, nếu không thì để trống
            // Chỉ lấy các liên kết có vẻ là khóa học
            if (url.startsWith('http') && !url.includes('example.com')) {
                courses.push({
                    title,
                    url,
                    thumbnail
                });
            }
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Kỹ năng hiện có"
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                                    />
                                    <Button variant="outlined" onClick={handleSkillAdd}>Thêm</Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {formData.existingSkills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            onDelete={handleSkillDelete(skill)}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Chủ đề quan tâm"
                                        value={currentInterest}
                                        onChange={(e) => setCurrentInterest(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                                    />
                                    <Button variant="outlined" onClick={handleInterestAdd}>Thêm</Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {formData.interests.map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            onDelete={handleInterestDelete(interest)}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
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
                            Khóa Học Được Đề Xuất
                        </Typography>
                        <Grid container spacing={2}>
                            {suggestedCourses.map((course, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                pt: '56.25%', // 16:9
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                color: '#1976d2'
                                            }}
                                        >
                                            {course.title.charAt(0)}
                                        </CardMedia>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" component="h3" textTransform='underline' fontWeight="bold">
                                                {course.title}
                                            </Typography>
                                            <Link href={course.url} target="_blank" rel="noopener">
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