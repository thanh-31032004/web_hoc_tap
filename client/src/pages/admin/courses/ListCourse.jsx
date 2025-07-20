import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Table,
    Button,
    Typography,
    Space,
    Popconfirm,
    Spin,
    message,
    Alert,
    Input,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchCourses, deleteCourse } from '../../../features/course/courseSlide';
import { toast } from 'react-toastify';

const { Search } = Input;

function AdminCourseListPage() {
    const dispatch = useDispatch();
    const { list: courses, loading, error } = useSelector((state) => state.course || { list: [] });

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    useEffect(() => {
        setFilteredCourses(courses);
    }, [courses]);

    const handleDelete = async (course) => {
        setLoadingDelete(true);
        try {
            await dispatch(deleteCourse(course._id)).unwrap();
            message.success(`Đã xóa khóa học "${course.title}"`);
            toast.success("Xóa khóa học thành công!");
        } catch (err) {
            message.error('Xóa thất bại');
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (text ? `${text.slice(0, 50)}...` : '—'),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (text) => text || '—',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, course) => (
                <Space>
                    <Link to={`/admin/courses/edit/${course._id}`}>
                        <Button icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title={`Bạn có chắc muốn xóa khóa học "${course.title}"?`}
                        onConfirm={() => handleDelete(course)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} loading={loadingDelete} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý Khóa học
                </Typography.Title>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Search
                        placeholder="Tìm theo tiêu đề"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        value={searchText}
                        allowClear
                        style={{ width: 250 }}
                    />
                    <Link to="/admin/courses/create">
                        <Button type="primary" icon={<PlusOutlined />}>
                            Tạo Khóa học mới
                        </Button>
                    </Link>
                </div>
            </div>

            {error && <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <Typography>Không tìm thấy khóa học phù hợp.</Typography>
            ) : (
                <Table
                    dataSource={filteredCourses}
                    columns={columns}
                    rowKey="_id"
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            )}
        </div>
    );
}

export default AdminCourseListPage;
