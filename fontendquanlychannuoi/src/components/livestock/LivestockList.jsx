import { useState } from 'react';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import LivestockTable from './LivestockTable';
import Pagination from './Pagination';
import ViewLivestock from './ViewLivestock';
import DeleteConfirmation from './DeleteConfirmation';
import EditLivestock from './EditLivestock';
import LivestockFilter from './LivestockFilter';
import Modal from './Modal';
import Notification from '../utils/Notification';
import { useLivestock } from './useLivestock';
import './LivestockList.css';

function LivestockList() {
  const {
    livestock,
    isLoading,
    totalRecords,
    currentPage,
    itemsPerPage,
    searchTerm,
    sortConfig,
    setSearchTerm,
    setCurrentPage,
    handleSort,
    handleUpdate,
    handleDelete,
    applyFilters
  } = useLivestock();

  const [showFilter, setShowFilter] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleView = (animal) => {
    setSelectedLivestock(animal);
    setShowViewModal(true);
    
  };

  const handleEdit = (animal) => {
    setSelectedLivestock(animal);
    setIsModalOpen(true);

  };

  const handleUpdateSubmit = async (updatedAnimal) => {
    try {
      const success = await handleUpdate(updatedAnimal);
      if (success) {
        setNotification({ message: 'Cập nhật vật nuôi thành công!', type: 'success' });
        setIsModalOpen(false);
      }
    } catch (error) {
      setNotification({ message: 'Cập nhật vật nuôi thất bại!', type: 'error' });
    }
  };

  const confirmDelete = async (id) => {
    try {
      const success = await handleDelete(id);
      if (success) {
        setNotification({ message: 'Xóa vật nuôi thành công!', type: 'success' });
        setShowDeleteModal(false);
        setSelectedLivestock(null);
      }
    } catch (error) {
      setNotification({ message: 'Xóa vật nuôi thất bại!', type: 'error' });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

      {showFilter && (
        <LivestockFilter onApplyFilters={applyFilters} />
      )}

      <LivestockTable
        livestock={livestock}
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
        onPageChange={setCurrentPage}
      />

      {showViewModal && (
        <ViewLivestock
          livestock={selectedLivestock}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLivestock(null);
          }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EditLivestock
          livestock={selectedLivestock}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleUpdateSubmit}
        />
      </Modal>

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
    </div>
  );
}

export default LivestockList;