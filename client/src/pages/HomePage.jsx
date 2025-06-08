import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../features/course/courseSlide';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const { list: courses, loading } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Khóa học dành cho bạn
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {course.thumbnail && (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={course.thumbnail}
                                        alt={course.title}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {course.title}
                                    </Typography>

                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        component={Link}
                                        to={`/courses/${course._id}`}
                                    >
                                        Xem
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default HomePage;
