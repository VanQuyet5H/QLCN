import React, { useState, useEffect } from 'react';
import './DanhSachAccount.css';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Notification from '../utils/Notification';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: null,
    createdFrom: '',
    createdTo: '',
    page: 1,
    pageSize: 10,
  });
  const [roleStats, setRoleStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ message: '', type: '' });
  // State cho modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hàm gọi API với debounce
  const debouncedFetchUsers = debounce(async (filters) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        isActive: filters.isActive === null ? undefined : filters.isActive,
      };

      const response = await axios.get('https://localhost:7185/api/Auth/DanhSachAccount', { params });
      if (response.data) {
        const { data, totalUsers, totalPages, roleStats, statusStats } = response.data;

        setUsers(data);
        setTotalUsers(totalUsers);
        setTotalPages(totalPages);
        setRoleStats(roleStats);
        setStatusStats(statusStats);
      } else {
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  }, 500); // Delay 500ms khi tìm kiếm

  // Gọi hàm debounced khi bộ lọc thay đổi
  useEffect(() => {
    debouncedFetchUsers(filters);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset về trang đầu khi thay đổi bộ lọc
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Hàm thay đổi trạng thái người dùng (Khóa/Mở khóa)
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const reponse = await axios.put(`https://localhost:7185/api/Auth/ChangeStatus?userId=${userId}&isActive=${!currentStatus}`);
      console.log('Api:', reponse.data);
      // Cập nhật trạng thái trong danh sách người dùng sau khi thay đổi
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      setError('Không thể thay đổi trạng thái người dùng');
    }
  };

  const handleConfirmUnlock = () => {
    if (selectedUser) {
      toggleUserStatus(selectedUser.id, selectedUser.isActive);
      setShowModal(false); // Đóng modal sau khi thực hiện thay đổi
    }
  };

  const openUnlockModal = (user) => {
    setSelectedUser(user); // Lưu thông tin người dùng vào state
    setShowModal(true); // Hiển thị modal
  };
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(`https://localhost:7185/api/Auth/update-role/${userId}`, {
        role: newRole,
      });

      setNotification({ message: 'Cập nhật vai trò thành công!', type: 'success' });

      // Cập nhật vai trò trong danh sách người dùng
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setNotification({ message: 'Không thể cập nhật vai trò người dùng!', type: 'error' });
      setError('Không thể cập nhật vai trò người dùng');
      console.error(error);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Quản lý tài khoản</h2>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <div className="statistics">
        <div className="user-stats">
          <h3>Tổng số tài khoản: {totalUsers}</h3>
        </div>
        <div className="role-stats">
          <h4>Thống kê theo vai trò:</h4>
          <ul>
            {roleStats.map((roleStat) => (
              <li key={roleStat.role}>
                {roleStat.role}: {roleStat.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="status-stats">
          <h4>Thống kê theo trạng thái:</h4>
          <ul>
            {statusStats.map((statusStat, index) => (
              <li key={index}>
                {statusStat.isActive ? 'Hoạt động' : 'Bị khóa'}: {statusStat.count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Quản trị viên</option>
          <option value="user">Người dùng</option>
        </select>
        <select
          value={filters.isActive === null ? '' : filters.isActive}
          onChange={(e) =>
            handleFilterChange('isActive', e.target.value === '' ? null : e.target.value === 'true')
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Bị khóa</option>
        </select>
        <input
          type="date"
          value={filters.createdFrom}
          onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
        />
        <input
          type="date"
          value={filters.createdTo}
          onChange={(e) => handleFilterChange('createdTo', e.target.value)}
        />
      </div>

      {/* Bảng danh sách tài khoản */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Hình Ảnh</th>
              <th>Họ và tên</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{(filters.page - 1) * filters.pageSize + index + 1}</td>
                  <td>
                    <img
                      src={user.image ? `${user.image}` : `default-avatar.jpg`}
                      alt="Avatar"
                      className="avatar"
                    />
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td><select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                  </select></td>
                  <td>{user.isActive ? 'Hoạt động' : 'Bị khóa'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => openUnlockModal(user)} // Mở modal khi click
                      className={`status-button ${user.isActive ? 'deactivate' : 'activate'}`}
                    >
                      {user.isActive ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal mở khóa */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{`Bạn có chắc chắn muốn mở khóa tài khoản của ${selectedUser?.fullName}?`}</h3>
            <div className="modal-actions">
              <button onClick={handleConfirmUnlock}>Xác nhận</button>
              <button onClick={() => setShowModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        {/* Nút quay lại trang trước */}
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page === 1}
        >
          {'<'}
        </button>

        {/* Hiển thị các nút phân trang */}
        {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={filters.page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        {/* Nút chuyển sang trang tiếp theo */}
        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default UserList;
