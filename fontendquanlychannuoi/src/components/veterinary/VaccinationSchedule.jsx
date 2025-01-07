import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox, IconButton, Paper } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import './VaccinationSchedule.css';
const VaccinationSchedule = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);
  const navigate = useNavigate();
  // Lấy danh sách tiêm chủng từ API
  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/TiemChung/GetVaccinations', {
          params: {
            page: currentPage,
            pageSize: pageSize,
            search: searchTerm,
            includeHistory: includeHistory,
          },
        });

        // In ra để kiểm tra cấu trúc của response
        console.log('API Response:', response.data);

        // Kiểm tra xem response có thuộc tính data và nó có phải là mảng không
        if (response.data && Array.isArray(response.data.data)) {
          const data = response.data.data;
          // Phân loại danh sách: Đã tiêm và chưa tiêm
          const completed = data.filter((v) => v.status === 'Đã Tiêm');
          const pending = data.filter((v) => v.status !== 'Đã Tiêm');

          // Sắp xếp theo ngày tiêm chủng
          completed.sort((a, b) => new Date(a.vaccinationDate) - new Date(b.vaccinationDate));
          pending.sort((a, b) => new Date(a.vaccinationDate) - new Date(b.vaccinationDate));

          setVaccinations([...pending, ...completed]); // Đẩy "Đã tiêm" xuống cuối
          setTotalRecords(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } else {
          console.error("Dữ liệu không phải mảng hoặc không tồn tại trong thuộc tính data:", response.data);
        }
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      }
    };

    fetchVaccinations();
  }, [currentPage, pageSize, searchTerm, includeHistory]);

  // Xử lý thay đổi từ ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý phân trang
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Xử lý thay đổi kích thước trang
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset về trang 1 khi thay đổi số lượng bản ghi mỗi trang
  };
  const handleEditVaccination = (vaccination) => {
    navigate(`/edit-schedule/${vaccination.vaccinationId}`, { state: { vaccination } });
  };
  // Mở form nhập thông tin tiêm
  const handleOpenForm = () => {
    setOpenForm(true);
    navigate('/add-schedule');
  };
  const handleIncludeHistoryChange = (event) => {
    setIncludeHistory(event.target.checked);
  };

  // Đóng form nhập thông tin tiêm
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <Box className="hide-scrollbar" sx={{ maxHeight: 500, overflowY: 'auto' }}>
      <Typography variant="h4" mb={3} align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Danh Sách Tiêm Chủng
      </Typography>

      {/* Nút Nhập Thông Tin Tiêm */}
      <Grid container spacing={3} mb={3} justifyContent="flex-end">
        <Grid item xs={6} sm={6} md={5} >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenForm}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
          >
            Nhập Thông Tin Tiêm
          </Button>
        </Grid>
      </Grid>

      {/* Tìm kiếm */}
      <Grid container spacing={3} mb={3} justifyContent="flex-start">
        <Grid item xs={6} sm={6} md={5}>
          <TextField
            fullWidth
            label="Tìm Kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
            sx={{ borderRadius: 1 }}
          />
        </Grid>

      </Grid>



      {/* Bảng Danh Sách Tiêm Chủng */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Stt</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Mã Vật Nuôi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Tên Vật Nuôi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Vaccine</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Ngày Tiêm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Trạng Thái
                <Checkbox
                  checked={includeHistory}
                  onChange={handleIncludeHistoryChange}
                  color="default"
                  sx={{
                    color: '#fff', // Đảm bảo checkbox màu trắng
                    '& .MuiSvgIcon-root': {
                      fontSize: 24, // Điều chỉnh kích thước của checkbox
                    },
                  }}
                /></TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Ghi Chú</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(vaccinations) && vaccinations.length > 0 ? (
              vaccinations.map((vaccination, index) => (
                <TableRow key={vaccination.vaccinationId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vaccination.animalId}</TableCell>
                  <TableCell>{vaccination.animalName}</TableCell>
                  <TableCell>{vaccination.animalType}</TableCell>
                  <TableCell>{vaccination.vaccineName}</TableCell>
                  <TableCell>{formatDate(vaccination.vaccinationDate)}</TableCell>
                  <TableCell>{vaccination.status}</TableCell>
                  <TableCell>{vaccination.note}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditVaccination(vaccination)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân Trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRecords}
        page={currentPage - 1}
        rowsPerPage={pageSize}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2, backgroundColor: '#fff', borderTop: '1px solid #ddd' }}
      />
    </Box>
  );
};

export default VaccinationSchedule;
