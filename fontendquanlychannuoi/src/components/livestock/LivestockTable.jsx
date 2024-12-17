import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './LivestockTable.css';

function LivestockTable({ livestock, onSort, sortConfig, onView, onEdit, onDelete }) {
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2); // Đảm bảo ngày luôn có 2 chữ số
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="livestock-table-container">
      <table className="livestock-table">
        <thead>
          <tr>
            <th onClick={() => onSort('id')}>
              Mã số {getSortIcon('id')}
            </th>
            <th onClick={() => onSort('name')}>
              Tên vật nuôi {getSortIcon('name')}
            </th>
            <th onClick={() => onSort('type')}>
              Loại {getSortIcon('type')}
            </th>
            <th onClick={() => onSort('gender')}>
              Loài {getSortIcon('gender')}
            </th>
            <th onClick={() => onSort('birthDate')}>
              Ngày Sinh {getSortIcon('birthDate')}
            </th>
            <th onClick={() => onSort('status')}>
              Trạng Thái {getSortIcon('status')}
            </th>
            <th onClick={() => onSort('weight')}>
              Cân nặng (kg) {getSortIcon('weight')}
            </th>
            <th onClick={() => onSort('breed')}>
              Giống {getSortIcon('breed')}
            </th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {livestock.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.name}</td>
              <td>{animal.type}</td>
              <td>{animal.gender}</td>
              <td>{formatDate(animal.birthDate)}</td>
              <td>
                <span className={`status ${animal.status === 'Khỏe mạnh' ? 'healthy' : 'treatment'}`}>
                  {animal.status}
                </span>
              </td>
              <td>{animal.weight}</td>
              <td>{animal.breed}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-view"
                    title="Xem chi tiết"
                    onClick={() => onView(animal)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-edit"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(animal)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    title="Xóa"
                    onClick={() => onDelete(animal)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LivestockTable;