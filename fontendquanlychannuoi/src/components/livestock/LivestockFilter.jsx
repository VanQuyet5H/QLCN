import { useState } from 'react';
import './LivestockFilter.css';

function LivestockFilter({ onApplyFilters  }) {
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    gender: '',
    birthRange: '', // Replacing birthDate with birthRange
    status: '',
    weight: '',
    breed: '',
  });

  // Xử lý khi thay đổi giá trị của bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi nhấn nút "Áp dụng"
  const handleApplyFilters = () => {
    onApplyFilters(filters); // Truyền các bộ lọc đến component cha
  };

  // Xử lý khi nhấn nút "Đặt lại"
  const handleResetFilters = () => {
    const defaultFilters = {
      name: '',
      type: '',
      gender: '',
      birthRange: '',
      status: '',
      weight: '',
      breed: '',
    };
  
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Loại vật nuôi</label>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="Lợn">Lợn</option>
          <option value="Bò">Bò</option>
          <option value="Gà">Gà</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Giới tính</label>
        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="Male">Đực</option>
          <option value="Female">Cái</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Khoảng thời gian sinh</label>
        <select name="birthRange" value={filters.birthRange} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="last-week">Tuần trước</option>
          <option value="last-month">Tháng trước</option>
          <option value="last-3-months">3 tháng gần đây</option>
          <option value="last-6-months">6 tháng gần đây</option>
          <option value="last-year">1 năm qua</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Tình trạng</label>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="Healthy">Khỏe mạnh</option>
          <option value="Sick">Đang điều trị</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Cân nặng</label>
        <select name="weight" value={filters.weight} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="200">200 kg</option>
          <option value="300-500">301-500 kg</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Giống</label>
        <select name="breed" value={filters.breed} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="Large White">Large White</option>
          <option value="Yorkshire">Yorkshire</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn-apply" onClick={handleApplyFilters}>
          Áp dụng
        </button>
        <button className="btn-reset" onClick={handleResetFilters}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}

export default LivestockFilter;
