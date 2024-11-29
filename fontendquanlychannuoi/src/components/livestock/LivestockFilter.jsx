import { useState } from 'react';
import './LivestockFilter.css';

function LivestockFilter() {
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    status: '',
    location: '',
    ageRange: '',
    weightRange: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Loại vật nuôi</label>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="bo-thit">Bò thịt</option>
          <option value="bo-sua">Bò sữa</option>
          <option value="heo-thit">Heo thịt</option>
          <option value="heo-nai">Heo nái</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Giống</label>
        <select name="breed" value={filters.breed} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="brahman">Brahman</option>
          <option value="holstein">Holstein Friesian</option>
          <option value="duroc">Duroc</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Tình trạng</label>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="healthy">Khỏe mạnh</option>
          <option value="treatment">Đang điều trị</option>
          <option value="quarantine">Cách ly</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Vị trí</label>
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="khu-a">Khu A</option>
          <option value="khu-b">Khu B</option>
          <option value="khu-c">Khu C</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Độ tuổi</label>
        <select name="ageRange" value={filters.ageRange} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="0-6">0-6 tháng</option>
          <option value="7-12">7-12 tháng</option>
          <option value="13-24">13-24 tháng</option>
          <option value="24+">Trên 24 tháng</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Cân nặng</label>
        <select name="weightRange" value={filters.weightRange} onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="0-100">0-100 kg</option>
          <option value="101-300">101-300 kg</option>
          <option value="301-500">301-500 kg</option>
          <option value="500+">Trên 500 kg</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn-apply">Áp dụng</button>
        <button className="btn-reset">Đặt lại</button>
      </div>
    </div>
  );
}

export default LivestockFilter;