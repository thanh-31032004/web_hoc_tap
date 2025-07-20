import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLessons } from '../features/lesson/lessonSlide';
import { fetchCourses } from '../features/course/courseSlide';

import {
    Row,
    Col,
    Typography,
    Card,
    Button,
    Collapse,
    Spin,
    Alert,
    Tag,
    Divider
} from 'antd';
import {
    PlayCircleOutlined,
    ReadOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    BookOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { list: lessons, loading: lessonsLoading, error: lessonsError } = useSelector((state) => state.lesson);
    const { list: courses, loading: coursesLoading, error: coursesError } = useSelector((state) => state.course);

    useEffect(() => {
        if (lessons.length === 0 && !lessonsLoading && !lessonsError) {
            dispatch(fetchLessons());
        }
        if (courses.length === 0 && !coursesLoading && !coursesError) {
            dispatch(fetchCourses());
        }
    }, [dispatch, lessons.length, courses.length]);

    const course = courses.find((c) => c._id === id);
    const filteredLessons = lessons
        .filter((lesson) => lesson.course === id || lesson.course?._id === id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const handleStartCourse = () => {
        if (filteredLessons.length > 0) {
            const firstLesson = filteredLessons[0];
            navigate(`/courses/${course._id}/lessons/${firstLesson._id}`);
        }
    };

    if (coursesLoading || lessonsLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (coursesError || lessonsError || !course) {
        return (
            <Alert
                message="Lỗi"
                description={coursesError || lessonsError || 'Không tìm thấy khóa học hoặc có lỗi xảy ra.'}
                type="error"
                showIcon
                style={{ margin: 20 }}
            />
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[24, 24]}>
                {/* Thông tin khóa học */}
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <Title level={3} style={{ marginBottom: 0 }}>
                                <ReadOutlined /> {course.title}
                            </Title>
                        }
                        bordered={false}
                    >
                        <ReactMarkdown>
                            {course.description || 'Không có mô tả cho khóa học này.'}
                        </ReactMarkdown>

                        <Divider />
                        <Text strong>Danh mục:</Text>{' '}
                        <Tag color="blue">{course.category || 'Không xác định'}</Tag>
                        <br />

                        <Divider />
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            size="large"
                            disabled={filteredLessons.length === 0}
                            onClick={handleStartCourse}
                            block
                        >
                            {filteredLessons.length > 0 ? 'Bắt đầu học' : 'Chưa có bài học'}
                        </Button>
                    </Card>
                </Col>

                {/* Nội dung khóa học */}
                <Col xs={24} md={12}>
                    <Card title={<Title level={4}><BookOutlined /> Nội dung khóa học</Title>} bordered={false}>
                        {filteredLessons.length === 0 ? (
                            <Text type="secondary">Không có bài học nào trong khóa học này.</Text>
                        ) : (
                            <Collapse accordion>
                                {filteredLessons.map((lesson, index) => (
                                    <Panel
                                        header={
                                            <span>
                                                <PlayCircleOutlined style={{ marginRight: 8 }} />
                                                {`${index + 1}. ${lesson.title}`}
                                            </span>
                                        }
                                        key={lesson._id}
                                    >
                                        <ReactMarkdown>{lesson.description}</ReactMarkdown>
                                        <Tag color="purple">Loại: {lesson.contentType}</Tag>
                                        <Tag color="geekblue">Thời lượng: {lesson.duration || 0} phút</Tag>
                                        <Divider />
                                        <Button type="link" href={`/courses/${course._id}/lessons/${lesson._id}`}>
                                            Xem chi tiết bài học
                                        </Button>
                                    </Panel>
                                ))}
                            </Collapse>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CourseDetailPage;
