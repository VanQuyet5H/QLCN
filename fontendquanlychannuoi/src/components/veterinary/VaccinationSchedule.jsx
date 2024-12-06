import { useState,useEffect } from 'react';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import './VaccinationSchedule.css';
import axios from 'axios';
function VaccinationSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy danh sách lịch tiêm phòng
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/TiemChung'); // URL của API
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch schedules');
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="vaccination-schedule">
      <div className="schedule-header">
        <h2>Lịch tiêm phòng</h2>
        <button className="btn-add">
          <FaPlus /> Thêm lịch tiêm
        </button>
      </div>

      <div className="schedule-content">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Mã tiêm</th>
              <th>Mã vật nuôi</th>
              <th>Loại</th>
              <th>Vaccine</th>
              <th>Ngày tiêm</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.vaccinationId}</td>
                <td>{schedule.animalId}</td>
                <td>{schedule.animalType}</td>
                <td>{schedule.vaccineName}</td>
                <td>{format(new Date(schedule.vaccinationDate), 'dd/MM/yyyy')}</td>
                <td>
                  <span className={`status ${schedule.status}`}>
                    {schedule.status === 'completed' ? 'Đã tiêm' : 'Chờ tiêm'}
                  </span>
                </td>
                <td>{schedule.notes}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-complete" title="Xác nhận tiêm">
                      <FaCheck />
                    </button>
                    <button className="btn-edit" title="Chỉnh sửa">
                      <FaEdit />
                    </button>
                    <button className="btn-delete" title="Xóa">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VaccinationSchedule;