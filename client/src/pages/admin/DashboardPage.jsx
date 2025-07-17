import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    Spin,
    Alert,
    Table,
    Typography
} from 'antd';
import { Column } from '@ant-design/plots';
import axiosInstance from '../../config/axios';

const { Title, Text } = Typography;

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const transformChartData = (statArray, labelName) => {
        return statArray?.map(item => ({
            month: `${item._id.month}/${item._id.year}`,
            count: item.count,
            category: labelName
        })) || [];
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Spin tip="Loading Dashboard..." />;
    if (error) return <Alert type="error" message={error} />;

    const userChartData = transformChartData(stats.userStats, 'User');
    const courseChartData = transformChartData(stats.courseStats, 'Course');
    const lessonChartData = transformChartData(stats.lessonStats, 'Lesson');
    const combinedData = [...userChartData, ...courseChartData, ...lessonChartData];

    const config = {
        data: combinedData,
        isGroup: true,
        xField: 'month',
        yField: 'count',
        seriesField: 'category',
        color: ['#1976d2', '#ff4d4f', '#52c41a'],
        label: {
            position: 'top',
            style: {
                fill: '#fff',
                opacity: 0.6,
            },
        },
        legend: {
            position: 'top'
        }
    };

    // ✅ Sửa tên fields ở bảng
    const topUserColumns = [
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Total Lessons Learned', dataIndex: 'totalCompletedLessons', key: 'totalCompletedLessons' }
    ];

    const topCourseColumns = [
        { title: 'Course Title', dataIndex: 'title', key: 'title' },
        { title: 'Lessons Completed', dataIndex: 'totalCompletedLessons', key: 'totalCompletedLessons' }
    ];

    return (
        <>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Tổng Users" value={stats.totalUsers} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Tổng Courses" value={stats.totalCourses} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Tổng Lessons" value={stats.totalLessons} />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Biểu đồ thống kê theo tháng">
                        <Column {...config} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Top Users (Nhiều bài học nhất)">
                        <Table
                            dataSource={stats.topUsers}
                            columns={topUserColumns}
                            pagination={false}
                            rowKey="username"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Top Courses (Được học nhiều nhất)">
                        <Table
                            dataSource={stats.topCourses}
                            columns={topCourseColumns}
                            pagination={false}
                            rowKey="title"
                        />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>
                            Tháng học nhiều nhất:
                        </Title>
                        {stats.peakMonth ? (
                            <>
                                <Text strong>
                                    Tháng {stats.peakMonth.month}/{stats.peakMonth.year}
                                </Text>
                                <br />
                                <Text>
                                    Tổng bài học đã học: {stats.peakMonth.totalLessons}
                                </Text>
                            </>
                        ) : (
                            <Text>Không có dữ liệu.</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardPage;
