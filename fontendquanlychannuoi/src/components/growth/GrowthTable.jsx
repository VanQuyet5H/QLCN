import './GrowthTable.css';

function GrowthTable({ records }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'fast': return 'status-fast';
      case 'slow': return 'status-slow';
      default: return 'status-normal';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'fast': return 'Nhanh';
      case 'slow': return 'Chậm';
      default: return 'Bình thường';
    }
  };

  return (
    <div className="growth-table-container">
      <table className="growth-table">
        <thead>
          <tr>
            <th>Mã số</th>
            <th>Loại</th>
            <th>Cân nặng ban đầu (kg)</th>
            <th>Cân nặng hiện tại (kg)</th>
            <th>Tăng trưởng (kg/ngày)</th>
            <th>Cập nhật cuối</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.type}</td>
              <td>{record.initialWeight}</td>
              <td>{record.currentWeight}</td>
              <td>{record.growthRate}</td>
              <td>{record.lastMeasured}</td>
              <td>
                <span className={`status ${getStatusClass(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GrowthTable;