import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import LivestockFilter from './LivestockFilter';
import Pagination from './Pagination';
import AddLivestock from './AddLivestock';
import ViewLivestock from './ViewLivestock';
import DeleteConfirmation from './DeleteConfirmation';
import './LivestockList.css';
import axios from 'axios';
import Notification from '../utils/Notification';
import EditLivestock from './EditLivestock';
function LivestockList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [livestock, setLivestock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [notification, setNotification] = useState({ message: '', type: '' });
 

  // Mock data - trong thực tế sẽ lấy từ API
  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      const params = { page: currentPage, pageSize: itemsPerPage, search: searchTerm };
      const response = await axios.get('https://localhost:7185/api/Animal', { params });
      console.log('Response data:', response.data);
      const { data, totalRecords } = response.data;
      setLivestock(data);
      setTotalRecords(totalRecords);
    } catch (err) {
      setError(err.message);
      setNotification({ message: 'Lỗi khi tải dữ liệu!', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchLivestock khi thay đổi currentPage, itemsPerPage, hoặc searchTerm
  useEffect(() => {
    fetchLivestock();
  }, [currentPage, itemsPerPage, searchTerm]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddLivestock = async (data) => {
    try {
      // Tạo dữ liệu cần gửi
      const payload = {
        name: data.name,
        type: data.type,
        gender: data.gender,
        birthDate: data.birthDate,
        status: data.status,
        weight: data.weight,
        breed: data.breed,
        createdAt: new Date().toISOString(), // Thời gian hiện tại
      };
  
      // Gọi API để thêm vật nuôi mới
      const response = await fetch('https://localhost:7185/api/Animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Kiểm tra phản hồi từ API
      if (response.ok) {
        const result = await response.json(); // Giả sử API trả về đối tượng vật nuôi vừa thêm
        setLivestock(prev => [...prev, result]); // Cập nhật danh sách vật nuôi trong state
        setShowAddForm(false); // Đóng form thêm vật nuôi
        setNotification({ message: 'Thêm vật nuôi thành công!', type: 'success' });
      } else {
        throw new Error('Không thể thêm vật nuôi');
      }
    } catch (error) {
      setNotification({ message: `Lỗi: ${error.message}`, type: 'error' });
    }
  };
  
  const handleView = async (id) => {
    try {
      const response = await axios.get('https://localhost:7185/api/Animal/${id}');
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu vật nuôi.');
      }
      const data = await response.json();
      setLivestock(data);
    } catch (err) {
      setError(err.message);
    } finally {
      
      setSelectedLivestock(id);
      setShowViewModal(true);
    }
  };
  const handleSubmit = async (id) => {
    try {
      // Tạo dữ liệu cần gửi
      const payload = {
        name: '',
        type: '',
        gender: '',
        birthDate: '',
        status: '',
        weight: '',
        breed: '',
        createdAt: new Date().toISOString(), // Thời gian hiện tại
      };
  
      // Gọi API để cập nhật vật nuôi
      const response = await axios.put(`https://localhost:7185/api/Animal/${id}`, payload);
  
      // Cập nhật danh sách vật nuôi trong state
      setLivestock((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );
  
      setShowAddForm(false); // Đóng form cập nhật
      setNotification({ message: 'Cập nhật vật nuôi thành công!', type: 'success' });
    } catch (error) {
      setNotification({
        message: `Lỗi: ${error.response?.data || error.message}`,
        type: 'error',
      });
    }
  };
  
  const handleDelete = (animal) => {
    setSelectedLivestock(animal);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7185/api/Animal/${id}`); // Sửa lại dấu nháy đơn ' và ' thành dấu nháy backtick `
      setLivestock(prev => prev.filter(item => item.id !== id));
      setNotification({ message: 'Xóa vật nuôi thành công!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Lỗi khi xóa vật nuôi!', type: 'error' });
    } finally {
      setShowDeleteModal(false);
      setSelectedLivestock(null);
    }
  };
  
  
  const filteredLivestock = livestock.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLivestock = [...livestock].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });
  const currentItems = sortedLivestock;
  const handleEditClick = async (id) => {
    try {
      // Tạo dữ liệu cần gửi
      const payload = {
        name: '',
        type: '',
        gender: '',
        birthDate: '',
        status: '',
        weight: '',
        breed: '',
        createdAt: new Date().toISOString(), // Thời gian hiện tại
      };
  
      // Gọi API để cập nhật vật nuôi
      const response = await axios.put(`https://localhost:7185/api/Animal/${id}`, payload);
  
      // Cập nhật danh sách vật nuôi trong state
      setLivestock((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );
  
      setShowAddForm(false); // Đóng form cập nhật
      setNotification({ message: 'Cập nhật vật nuôi thành công!', type: 'success' });
    } catch (error) {
      setNotification({
        message: `Lỗi: ${error.response?.data || error.message}`,
        type: 'error',
      });
    }
  };

  return (
    <div className="livestock-list">
      <div className="livestock-header">
        <h1>Quản lý vật nuôi</h1>
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Thêm mới
        </button>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <div className="livestock-tools">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="tool-buttons">
          <button
            className={`btn-filter ${showFilter ? 'active' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter /> Lọc
          </button>
          <button className="btn-sort">
            <FaSort /> Sắp xếp
          </button>
        </div>
      </div>

      {showFilter && <LivestockFilter />}

      {showAddForm && (
        <AddLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowAddForm(false);
            setSelectedLivestock(null);
          }}
          onSubmit={handleAddLivestock}
        />
      )}
      {showEditForm && (
        <EditLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowEditForm(false);
            setSelectedLivestock(null);
          }}
          onSubmit={handleEditClick}
        />
      )}

      {showViewModal && (
        <ViewLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          livestock={selectedLivestock}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}

      <LivestockTable
        livestock={currentItems}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={handleView}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={totalRecords}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default LivestockList;