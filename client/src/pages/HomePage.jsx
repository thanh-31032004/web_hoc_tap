import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../features/course/courseSlide';
import {
    Row,
    Col,
    Card,
    Typography,
    Input,
    Select,
    Spin,
    Button,
    Pagination
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
    const dispatch = useDispatch();
    const { list: courses, loading } = useSelector((state) => state.course);
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
    }, [search, category, difficulty]);

    const filteredCourses = courses.filter((course) => {
        const matchTitle = course.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category ? course.category === category : true;
        const matchDifficulty = difficulty ? course.difficulty === difficulty : true;
        return matchTitle && matchCategory && matchDifficulty;
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Khóa học dành cho bạn</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12} lg={8}>
                    <Search
                        placeholder="Tìm kiếm theo tiêu đề"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Select
                        placeholder="Danh mục"
                        value={category}
                        onChange={(value) => setCategory(value)}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="Web Development">Web Development</Option>
                        <Option value="Mobile Development">Mobile Development</Option>
                        <Option value="Data Science">Data Science</Option>
                        <Option value="Game Development">Game Development</Option>
                    </Select>
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Select
                        placeholder="Độ khó"
                        value={difficulty}
                        onChange={(value) => setDifficulty(value)}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="Beginner">Beginner</Option>
                        <Option value="Intermediate">Intermediate</Option>
                        <Option value="Advanced">Advanced</Option>
                    </Select>
                </Col>
            </Row>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <Spin size="large" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <Text>Không tìm thấy khóa học phù hợp.</Text>
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {paginatedCourses.map((course) => (
                            <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    cover={
                                        <img
                                            alt={course.title}
                                            src={course.thumbnail}
                                            style={{ height: 180, objectFit: 'cover' }}
                                        />
                                    }
                                    hoverable
                                >
                                    <Card.Meta
                                        title={course.title}
                                        description={
                                            <>
                                                <p><strong>Danh mục:</strong> {course.category}</p>
                                                <p><strong>Độ khó:</strong> {course.difficulty}</p>
                                            </>
                                        }
                                    />
                                    <Button
                                        type="primary"
                                        block
                                        style={{ marginTop: 12 }}
                                        onClick={() => navigate(`/courses/${course._id}`)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row justify="center" style={{ marginTop: 32 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredCourses.length}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                    </Row>
                </>
            )}
        </div>
    );
};

export default HomePage;
