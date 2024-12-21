import React, { useEffect, useState } from 'react';

function CageStatistics() {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    // Lấy thống kê chuồng từ API
    const fetchStatistics = async () => {
      const response = await fetch('/api/cage/statistics'); // Thay bằng API thật của bạn
      const data = await response.json();
      setStatistics(data);
    };
    fetchStatistics();
  }, []);

  return (
    <div>
      <h2>Thống Kê Chuồng Trại</h2>
      <ul>
        {statistics.map((stat, index) => (
          <li key={index}>
            {stat.cageName}: {stat.capacity} chỗ, {stat.currentOccupancy} hiện có, {stat.availableSlots} còn trống
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CageStatistics;
