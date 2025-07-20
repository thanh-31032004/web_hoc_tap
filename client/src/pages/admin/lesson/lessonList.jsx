import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons, deleteLesson } from '../../../features/lesson/lessonSlide';
import { Link } from 'react-router-dom';
import {
    Table,
    Typography,
    Button,
    Spin,
    Space,
    message,
    Popconfirm,
    Input,
} from 'antd';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Search } = Input;

const AdminLessonListPage = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.lesson);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    useEffect(() => {
        setFilteredData(list); // Ban đầu hiển thị toàn bộ
    }, [list]);

    const handleDelete = (id) => {
        dispatch(deleteLesson(id));
        toast.success("Xóa bài học thành công!");
        message.success('Đã xóa bài học');
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = list.filter((lesson) =>
            lesson.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
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
            render: (text) =>
                text.length > 100 ? `${text.slice(0, 20)}...` : text,
        },
        {
            title: 'Khóa học',
            dataIndex: 'course',
            key: 'course',
            render: (course) =>
                typeof course === 'object' ? course.title : course,
        },
        {
            title: 'Loại nội dung',
            dataIndex: 'contentType',
            key: 'contentType',
        },
        {
            title: 'Nội dung',
            key: 'content',
            render: (record) =>
                record.contentType === 'text'
                    ? `${record.contentText?.slice(0, 50)}...`
                    : record.contentUrl,
        },
        {
            title: 'Thứ tự',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'Thời lượng (phút)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small">
                        <Link to={`/admin/lessons/edit/${record._id}`}>Sửa</Link>
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa bài học này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger type="link" size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Danh sách bài học</Title>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
                <Button type="primary">
                    <Link to="/admin/lessons/create">Thêm bài học</Link>
                </Button>

                <Search
                    placeholder="Tìm bài học theo tiêu đề"
                    onSearch={handleSearch}
                    allowClear
                    enterButton
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Spin />
            ) : error ? (
                <Typography.Text type="danger">{error}</Typography.Text>
            ) : (
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={filteredData}
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            )}
        </div>
    );
};

export default AdminLessonListPage;