import { useState } from 'react';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import './VaccinationSchedule.css';

function VaccinationSchedule() {
  const [schedules] = useState([
    {
      id: 'VAC001',
      animalId: 'B001',
      type: 'Bò thịt',
      vaccine: 'Lở mồm long móng',
      dueDate: '2023-12-15',
      status: 'pending',
      notes: 'Tiêm phòng định kỳ 6 tháng'
    },
    {
      id: 'VAC002',
      animalId: 'H001',
      type: 'Heo thịt',
      vaccine: 'PRRS',
      dueDate: '2023-12-20',
      status: 'completed',
      notes: 'Đã tiêm ngày 20/12/2023'
    }
  ]);

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
                <td>{schedule.id}</td>
                <td>{schedule.animalId}</td>
                <td>{schedule.type}</td>
                <td>{schedule.vaccine}</td>
                <td>{format(new Date(schedule.dueDate), 'dd/MM/yyyy')}</td>
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