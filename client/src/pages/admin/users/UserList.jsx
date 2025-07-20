import React, { useEffect, useState } from 'react';
import {
    Table,
    Space,
    Button,
    Input,
    Typography,
    Popconfirm,
    Tag,
    message,
    notification,
} from 'antd';
import { DeleteOutlined, UserOutlined, CrownOutlined } from '@ant-design/icons';
import axiosInstance from '../../../config/axios';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Search } = Input;

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('auth/users');
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            message.error(err.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`auth/users/${id}`);
            const updated = users.filter(user => user._id !== id);
            setUsers(updated);
            setFilteredUsers(updated);
            toast.success("Xoá người dùng thành công!");
            message.success('Xoá người dùng thành công');
        } catch (err) {
            message.error(err.response?.data?.message || 'Lỗi khi xoá người dùng');
        }
    };

    const handleToggleAdmin = async (user) => {
        const newRole = user.role === 'admin' ? 'student' : 'admin';
        try {
            await axiosInstance.put(`auth/users/${user._id}`, { role: newRole });
            const updated = users.map(u => u._id === user._id ? { ...u, role: newRole } : u);
            setUsers(updated);
            setFilteredUsers(updated);
            notification.success({
                message: 'Cập nhật quyền',
                description: `Đã đổi quyền của ${user.username} thành ${newRole}`,
            });
        } catch (err) {
            message.error(err.response?.data?.message || 'Lỗi khi đổi quyền');
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        const filtered = users.filter(
            (user) =>
                user.username?.toLowerCase().includes(value.toLowerCase()) ||
                user.email?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'gold' : 'blue'}>
                    {role === 'admin' ? 'Admin' : 'Student'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, user) => (
                <Space>
                    <Button
                        type={user.role === 'admin' ? 'default' : 'primary'}
                        icon={user.role === 'admin' ? <UserOutlined /> : <CrownOutlined />}
                        onClick={() => handleToggleAdmin(user)}
                    >
                        {user.role === 'admin' ? 'Bỏ quyền' : 'Cấp quyền'}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xoá người dùng này?"
                        onConfirm={() => handleDelete(user._id)}
                        okText="Xoá"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />}>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Quản lý người dùng</Title>
            <Search
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                style={{ maxWidth: 400, marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                locale={{ emptyText: 'Không có người dùng nào' }}
            />
        </div>
    );
};

export default UserListPage;
