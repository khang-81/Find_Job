import { useState, useEffect } from 'react';
import api from '../../api/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    // Fetch danh sách người dùng
    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);  // Log lỗi nếu không lấy được người dùng
            alert('Có lỗi xảy ra khi tải dữ liệu người dùng!');
        }
    };

    // Gọi API để fetch dữ liệu người dùng khi component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm xử lý toggle trạng thái người dùng
    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
            alert('Cập nhật trạng thái thành công!');
            fetchUsers();  // Tải lại danh sách người dùng
        } catch (err) {
            console.error('Error updating user status:', err);  // Log lỗi nếu cập nhật thất bại
            alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng!');
        }
    };

    return (
        <div className="card">
            <h3>Quản lý người dùng</h3>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Họ Tên</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.UserId}>
                            <td>{user.Email}</td>
                            <td>{user.FullName}</td>
                            <td>{user.RoleName}</td>
                            <td>{user.IsActive ? 'Hoạt động' : 'Bị khóa'}</td>
                            <td>
                                <button 
                                    className="secondary" 
                                    onClick={() => handleStatusToggle(user.UserId, user.IsActive)}>
                                    {user.IsActive ? 'Khóa' : 'Mở khóa'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
