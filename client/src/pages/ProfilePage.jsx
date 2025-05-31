// src/components/ProfilePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';

function ProfilePage() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return <div className="profile-page-error">Bạn chưa đăng nhập.</div>;
    }
    if (!user || Object.keys(user).length === 0) {
        return <p>Không tìm thấy thông tin người dùng.</p>;
    }
    return (
        <div className="profile-page">
            <h1>Thông tin cá nhân</h1>
            <div className="profile-details">
                <p><strong>ID:</strong> {user._id || 'N/A'}</p>
                <p><strong>Tên đăng nhập:</strong> {user.username || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                <p><strong>Quyền:</strong> {user.role || 'N/A'}</p>

                {/* Nếu bạn có avatar */}
                {user.avatar && (
                    <img
                        src={user.avatar}
                        alt="Avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
