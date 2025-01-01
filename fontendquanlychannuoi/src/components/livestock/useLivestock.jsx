import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLivestock = () => {
  const [livestock, setLivestock] = useState([]);
  const [filteredLivestock, setFilteredLivestock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    gender: '',
    birthRange: '',
    status: '',
    weight: '',
    breed: '',
    cage: '',
    withoutCage: false,
  });

  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm,
      };
  
      console.log('Calling API with params:', params);
  
      const response = await axios.get('https://localhost:7185/api/Animal', { params });
  
      const { data, totalRecords } = response.data;
      setLivestock(data); // Cập nhật dữ liệu vật nuôi
      setTotalRecords(totalRecords); // Cập nhật tổng số bản ghi
      setFilteredLivestock(data); // Cập nhật dữ liệu đã lọc
    } catch (error) {
      console.error('Error fetching livestock:', error);
      alert('Không thể tải dữ liệu vật nuôi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleUpdate = async (updatedAnimal) => {
    try {
      const response = await axios.put(
        `https://localhost:7185/api/Animal/${updatedAnimal.id}`,
        updatedAnimal
      );
      if (response.status === 200) {
        setLivestock(prev =>
          prev.map(animal => animal.id === updatedAnimal.id ? response.data : animal)
        );
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Failed to update livestock');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7185/api/Animal/${id}`);
      setLivestock(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      throw new Error('Failed to delete livestock');
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setSearchTerm(newFilters.name);
    setCurrentPage(1);
  };
  //load dữ liệu
  useEffect(() => {
    fetchLivestock();
  }, [currentPage, itemsPerPage, searchTerm]);
  //hàm lọc
  useEffect(() => {
    const filterData = () => {
      const filtered = livestock.filter(animal => {
        const animalBirthDate = new Date(animal.birthDate);
        const getDateRange = (range) => {
          const today = new Date();
          switch (range) {
            case 'last-week':
              today.setDate(today.getDate() - 7);
              return today;
            case 'last-month':
              today.setMonth(today.getMonth() - 1);
              return today;
            case 'last-3-months':
              today.setMonth(today.getMonth() - 3);
              return today;
            case 'last-6-months':
              today.setMonth(today.getMonth() - 6);
              return today;
            case 'last-year':
              today.setFullYear(today.getFullYear() - 1);
              return today;
            default:
              return today;
          }
        };

        const filterBirthDate = filters.birthRange ?
          animalBirthDate >= getDateRange(filters.birthRange) : true;
        const filterCage =
          filters.cage && animal.cage
            ? animal.cage.id === parseInt(filters.cage) || // Compare with cage ID
            animal.cage.name?.toLowerCase() === filters.cage.toLowerCase() // Compare with cage name
            : true;

        const filterNoCage = filters.withoutCage
          ? animal.cage?.name === 'Chưa gán chuồng'
          : true;
        return (
          (filters.name ? animal.name?.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
          (filters.type ? animal.type?.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
          (filters.gender ? animal.gender?.toLowerCase() === filters.gender.toLowerCase() : true) &&
          filterBirthDate &&
          (filters.status ? animal.status?.toLowerCase() === filters.status.toLowerCase() : true) &&
          (filters.weight ? animal.weight === parseInt(filters.weight) : true) &&
          (filters.breed ? animal.breed?.toLowerCase().includes(filters.breed.toLowerCase()) : true) &&
          filterCage && filterNoCage
        );
      });

      const searchFiltered = filtered.filter(animal =>
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const sorted = [...searchFiltered].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      });

      setFilteredLivestock(sorted);
    };

    filterData();
  }, [filters, searchTerm, livestock, sortConfig]);

  return {
    livestock: filteredLivestock,
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
    applyFilters,
    setLivestock,
  };
};