import { useState } from 'react';
import { FaPlus, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import './MedicineInventory.css';

function MedicineInventory() {
  const [medicines] = useState([
    {
      id: 'MED001',
      name: 'Terramycin',
      category: 'Kháng sinh',
      unit: 'Lọ',
      quantity: 50,
      minQuantity: 20,
      expiryDate: '2024-12-31',
      supplier: 'Công ty Dược Thú y A'
    },
    {
      id: 'MED002',
      name: 'Vitamin AD3E',
      category: 'Vitamin',
      unit: 'Chai',
      quantity: 15,
      minQuantity: 25,
      expiryDate: '2024-06-30',
      supplier: 'Công ty Dược Thú y B'
    }
  ]);

  return (
    <div className="medicine-inventory">
      <div className="inventory-header">
        <h2>Quản lý thuốc và vật tư</h2>
        <button className="btn-add">
          <FaPlus /> Thêm thuốc mới
        </button>
      </div>

      <div className="inventory-tools">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm thuốc..."
          />
        </div>
      </div>

      <div className="inventory-alerts">
        {medicines.map(med => 
          med.quantity < med.minQuantity && (
            <div key={med.id} className="alert-item">
              <FaExclamationTriangle className="alert-icon" />
              <div className="alert-content">
                <p>Cảnh báo: {med.name} dưới mức tồn kho tối thiểu</p>
                <span>Hiện tại: {med.quantity} {med.unit} (Tối thiểu: {med.minQuantity})</span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Mã thuốc</th>
              <th>Tên thuốc</th>
              <th>Phân loại</th>
              <th>Đơn vị</th>
              <th>Số lượng</th>
              <th>Hạn sử dụng</th>
              <th>Nhà cung cấp</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(medicine => (
              <tr key={medicine.id}>
                <td>{medicine.id}</td>
                <td>{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.unit}</td>
                <td>
                  <span className={`quantity ${medicine.quantity < medicine.minQuantity ? 'low' : ''}`}>
                    {medicine.quantity}
                  </span>
                </td>
                <td>{new Date(medicine.expiryDate).toLocaleDateString('vi-VN')}</td>
                <td>{medicine.supplier}</td>
                <td>
                  <span className={`status ${medicine.quantity < medicine.minQuantity ? 'warning' : 'normal'}`}>
                    {medicine.quantity < medicine.minQuantity ? 'Cần nhập thêm' : 'Bình thường'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedicineInventory;