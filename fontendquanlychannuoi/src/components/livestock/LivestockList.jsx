import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import Pagination from './Pagination';
import ViewLivestock from './ViewLivestock';
import DeleteConfirmation from './DeleteConfirmation';
import EditLivestock from './EditLivestock';
import './LivestockList.css';
import axios from 'axios';
import Notification from '../utils/Notification';
import LivestockFilter from './LivestockFilter'; // Đảm bảo có LivestockFilter component

function LivestockList() {
  const [filteredLivestock1, setFilteredLivestock] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [livestock, setLivestock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [filters, setFilters] = useState({ name: '', type: '', gender: '', birthRange: '', status: '', weight: '', breed: '' });
  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      const params = { page: currentPage, pageSize: itemsPerPage, search: searchTerm };
      const response = await axios.get('https://localhost:7185/api/Animal', { params });
      const { data, totalRecords } = response.data;
      setLivestock(data);
      setTotalRecords(totalRecords);
      setFilteredLivestock(data); 
    } catch (err) {
      setNotification({ message: 'Lỗi khi tải dữ liệu!', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const filtered = livestock.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredLivestock(filtered);
  }, [searchTerm, livestock]);
  // Gọi fetchLivestock khi thay đổi currentPage, itemsPerPage, hoặc searchTerm
  useEffect(() => {
    fetchLivestock();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    fetchLivestock();
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleView = (animal) => {
    setSelectedLivestock(animal);
    setShowViewModal(true);
  };
  const handleUpdate = async (updatedAnimal) => {
    try {
      const response = await axios.put(
        `https://localhost:7185/api/Animal/${updatedAnimal.id}`,
        updatedAnimal
      );
      console.log('Dữ liệu vật nuôi trước khi cập nhật: ', updatedAnimal);
      console.log('Dữ liệu vật nuôi sau khi cập nhật: ', response.data);

      if (response.status === 200) {
        await fetchLivestock();
        // Cập nhật danh sách vật nuôi sau khi chỉnh sửa thành công
        setLivestock((prev) =>
          prev.map((animal) =>
            animal.id === updatedAnimal.id ? response.data : animal
          )
        );

        setNotification({
          message: 'Cập nhật vật nuôi thành công!',
          type: 'success',
        });
        setShowEditForm(false);
        setSelectedLivestock(null);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật vật nuôi:', err);
      setNotification({
        message: 'Cập nhật vật nuôi thất bại!',
        type: 'error',
      });
    }
  };
  const handleEdit = (animal) => {
    setSelectedLivestock(animal);
    setShowEditForm(true);
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7185/api/Animal/${id}`);
      setLivestock((prev) => prev.filter((item) => item.id !== id));
      setNotification({ message: 'Xóa vật nuôi thành công!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Lỗi khi xóa vật nuôi!', type: 'error' });
    } finally {
      setShowDeleteModal(false);
      setSelectedLivestock(null);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Lọc dữ liệu vật nuôi theo các điều kiện
  const filteredLivestock = livestock.filter((animal) => {
    // Chuyển đổi ngày sinh vật nuôi từ chuỗi sang đối tượng Date
    const animalBirthDate = new Date(animal.birthDate);

    // Tạo hàm để tính khoảng thời gian cho bộ lọc
    const getDateRange = (range) => {
      const today = new Date();
      switch (range) {
        case 'last-week': // 7 ngày trước
          today.setDate(today.getDate() - 7);
          return today;
        case 'last-month': // 30 ngày trước
          today.setMonth(today.getMonth() - 1);
          return today;
        case 'last-3-months': // 90 ngày trước
          today.setMonth(today.getMonth() - 3);
          return today;
        case 'last-6-months': // 180 ngày trước
          today.setMonth(today.getMonth() - 6);
          return today;
        case 'last-year': // 1 năm trước
          today.setFullYear(today.getFullYear() - 1);
          return today;
        default:
          return today; // Nếu không có giá trị lọc
      }
    };

    const filterBirthDate = filters.birthRange ? animalBirthDate >= getDateRange(filters.birthRange) : true;

    return (
      (filters.name ? animal.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
      (filters.type ? animal.type.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
      (filters.gender ? animal.gender.toLowerCase() === filters.gender.toLowerCase() : true) &&
      filterBirthDate &&
      (filters.status ? animal.status.toLowerCase() === filters.status.toLowerCase() : true) &&
      (filters.weight ? animal.weight === parseInt(filters.weight) : true) &&
      (filters.breed ? animal.breed.toLowerCase().includes(filters.breed.toLowerCase()) : true)
    );
  });
  const sortedLivestock = [...filteredLivestock].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, sortedLivestock.length);
  const indexOfFirstItem = Math.min(indexOfLastItem - itemsPerPage, sortedLivestock.length);
  const currentItems = sortedLivestock.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="livestock-list">
      <div className="livestock-header">
        <h1>Quản lý vật nuôi</h1>
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
          <button className="btn-sort" onClick={handleSort}>
            <FaSort /> Sắp xếp
          </button>
        </div>
      </div>

      {showFilter && <LivestockFilter onApplyFilters={handleApplyFilters} filter={filters} />}
      {showViewModal && (
        <ViewLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}
      {showEditForm && (
        <EditLivestock
          livestock={selectedLivestock}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedLivestock(null);
          }}
          onSubmit={handleUpdate}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmation
          livestock={selectedLivestock}
          onConfirm={() => confirmDelete(selectedLivestock.id)}
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
        onEdit={handleEdit}
        onView={handleView}
        onDelete={(animal) => {
          setSelectedLivestock(animal);
          setShowDeleteModal(true);
        }}
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
