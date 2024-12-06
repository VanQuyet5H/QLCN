import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './BreedTable.css';

function BreedTable({ breeds, onEdit, onDelete }) {
  return (
    <div className="breed-table-container">
      <table className="breed-table">
        <thead>
          <tr>
            <th>Mã giống</th>
            <th>Tên giống</th>
            <th>Loại</th>
            <th>Xuất xứ</th>
            <th>Cân nặng TB (kg)</th>
            <th>Tăng trưởng (kg/ngày)</th>
            <th>Chất lượng thịt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {breeds.map((breed) => (
            <tr key={breed.id}>
              <td>{breed.id}</td>
              <td>{breed.name}</td>
              <td>{breed.type === 'cattle' ? 'Bò thịt' : 
                   breed.type === 'dairy' ? 'Bò sữa' : 'Heo'}</td>
              <td>{breed.origin}</td>
              <td>{breed.avgWeight}</td>
              <td>{breed.avgGrowthRate}</td>
              <td>{breed.meatQuality}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-view" 
                    title="Xem chi tiết"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="btn-edit" 
                    title="Chỉnh sửa"
                    onClick={() => onEdit(breed)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-delete" 
                    title="Xóa"
                    onClick={() => onDelete(breed)}
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

export default BreedTable;