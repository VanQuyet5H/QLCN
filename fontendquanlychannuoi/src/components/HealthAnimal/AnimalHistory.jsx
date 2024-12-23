import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, TextField, Button } from "@mui/material";

const AnimalHistory = () => {
  const [animals, setAnimals] = useState([]); // Dữ liệu vật nuôi
  const [totalRecords, setTotalRecords] = useState(0); // Tổng số bản ghi
  const [page, setPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số lượng bản ghi mỗi trang
  const [loading, setLoading] = useState(false); // Biến trạng thái để hiển thị loading
  const [searchId, setSearchId] = useState(""); 
  // Hàm để gọi API với phân trang
  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7185/with-health-records`, {
        params: {
          page: page + 1, // API yêu cầu số trang bắt đầu từ 1
          size: pageSize,
        }
      });
      console.log("API Response:", response.data);
      setAnimals(response.data.animals || []); // Đảm bảo animals là mảng, nếu không có thì gán mảng rỗng
      setTotalRecords(response.data.totalRecords || 0); // Đảm bảo totalRecords có giá trị mặc định
    } catch (error) {
      console.error("Error fetching animals data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount và khi thay đổi trang
  useEffect(() => {
    fetchAnimals();
  }, [page, pageSize]);

  // Hàm xử lý khi thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý khi thay đổi số bản ghi mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset lại trang khi thay đổi số bản ghi mỗi trang
  };
   // Hàm xử lý tìm kiếm theo ID
   const handleSearchChange = (event) => {
    setSearchId(event.target.value); // Lưu giá trị tìm kiếm vào state
  };

  const handleSearch = () => {
    setPage(0); // Reset lại trang khi thực hiện tìm kiếm
    fetchAnimals(); // Gọi lại API với tham số tìm kiếm
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Lịch sử theo dõi điều trị
      </Typography>
      <div style={{ marginBottom: '20px' }}>
  <TextField
    label="Tìm kiếm theo ID"
    variant="outlined"
    value={searchId}
    onChange={handleSearchChange}
    style={{ marginRight: '10px', width: '200px' }} // Đặt chiều rộng của TextField
    size="small" // Kích thước nhỏ hơn
  />
  <Button
  variant="contained"
  onClick={handleSearch}
  size="small"
  sx={{
    height: '40px', // Đặt chiều cao cho nút
    padding: '0 16px', // Điều chỉnh padding bên trong nút
    fontSize: '14px', // Điều chỉnh kích thước chữ nếu cần
  }}
>
  Tìm kiếm
</Button>

</div>

      {/* Kiểm tra nếu mảng animals rỗng */}
      {loading ? (
        <Typography variant="h6" color="textSecondary">
          Đang tải dữ liệu...
        </Typography>
      ) : animals.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Không có lịch sử theo dõi vật nuôi
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Giới Tính</TableCell>
                <TableCell>Ngày Sinh</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Cân Nặng</TableCell>
                <TableCell>Giống</TableCell>
                <TableCell>Ngày Tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.id}</TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{new Date(animal.birthDate).toLocaleDateString()}</TableCell>
                  <TableCell>{animal.status}</TableCell>
                  <TableCell>{animal.weight}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{new Date(animal.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalRecords}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default AnimalHistory;
