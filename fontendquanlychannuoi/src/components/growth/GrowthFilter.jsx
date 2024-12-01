import './GrowthFilter.css';

function GrowthFilter({ 
  selectedPeriod, 
  setSelectedPeriod, 
  selectedType, 
  setSelectedType,
  selectedMetric,
  setSelectedMetric 
}) {
  return (
    <div className="growth-filter">
      <div className="filter-group">
        <label>Thời gian:</label>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Loại vật nuôi:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="cattle">Bò thịt</option>
          <option value="dairy">Bò sữa</option>
          <option value="pig">Heo thịt</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Chỉ số:</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="weight">Cân nặng</option>
          <option value="growth">Tăng trưởng</option>
          <option value="count">Số lượng</option>
        </select>
      </div>
    </div>
  );
}

export default GrowthFilter;