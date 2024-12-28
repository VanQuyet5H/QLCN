import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";

const AnimalHistory = () => {
  const [animals, setAnimals] = useState([]); // Dữ liệu vật nuôi
  const [totalRecords, setTotalRecords] = useState(0); // Tổng số bản ghi
  const [page, setPage] = useState(0); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số lượng bản ghi mỗi trang
  const [loading, setLoading] = useState(false); // Biến trạng thái để hiển thị loading
  const [searchId, setSearchId] = useState("");
  const [openModal, setOpenModal] = useState(false); // Trạng thái mở modal
  const [selectedAnimal, setSelectedAnimal] = useState(null); // Thông tin vật nuôi đã chọn
  const [healthRecordDetails, setHealthRecordDetails] = useState([]); // Thông tin hồ sơ điều trị
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số (tháng bắt đầu từ 0)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Trả về theo định dạng dd/mm/yyyy
  };
  
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
  const handleOpenModal = async (animalId) => {
    try {
      const response = await axios.get(`https://localhost:7185/${animalId}`);
      console.log('apihealthrecord', response.data);
      setHealthRecordDetails(Array.isArray(response.data) ? response.data : []);
      setSelectedAnimal(animalId);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching health records:", error);
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnimal(null);
    setHealthRecordDetails([]);
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
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.id}</TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{formatDate(animal.birthDate)}</TableCell>
                  <TableCell>{animal.status}</TableCell>
                  <TableCell>{animal.weight}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{formatDate(animal.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleOpenModal(animal.id)}>
                      Xem chi tiết
                    </Button>
                  </TableCell>
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
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Chi Tiết Hồ Sơ Điều Trị</DialogTitle>
  <DialogContent sx={{ padding: 3 }}>
    {healthRecordDetails && healthRecordDetails.length > 0 ? (
      healthRecordDetails.map((record, index) => (
        <Box key={index} sx={{ marginBottom: 4, padding: 2, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f50057", marginBottom: 2 }}>
            Lần khám: {index + 1}
          </Typography>

          {/* Chuẩn đoán */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: 1 }}>
              <strong>Chuẩn đoán</strong>
            </Typography>
            <Typography variant="body2">
              <strong>Ngày khám:</strong> {formatDate(record.checkupDate)}
            </Typography>
            <Typography variant="body2">
              <strong>Chẩn đoán:</strong> {record.diagnosis}
            </Typography>
            <Typography variant="body2">
              <strong>Ghi chú:</strong> {record.notes}
            </Typography>
          </Box>

          {/* Điều trị */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: 1 }}>
              <strong>Điều trị</strong>
            </Typography>
            <Typography variant="body2">
              <strong>Tên điều trị:</strong> {record.treatmentName}
            </Typography>
            <Typography variant="body2">
              <strong>Mô tả:</strong> {record.treatmentDescription || "Không có thông tin"}
            </Typography>
            <Typography variant="body2">
              <strong>Ngày tạo kế hoạch:</strong> {record.treatmentCreatedAt 
                ? new Date(record.treatmentCreatedAt).toLocaleDateString()
                : "Không xác định"}
            </Typography>
          </Box>

          {/* Thuốc */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: 1 }}>
              <strong>Thuốc</strong>
            </Typography>
            <Typography variant="body2">
              <strong>Tên thuốc:</strong> {record.medicationName}
            </Typography>
            <Typography variant="body2">
              <strong>Liều dùng:</strong> {record.dosage} mg
            </Typography>
            <Typography variant="body2">
              <strong>Tần suất:</strong> {record.frequency}
            </Typography>
            <Typography variant="body2">
              <strong>Mô tả thuốc:</strong> {record.medicationDescription || "Không có thông tin"}
            </Typography>
          </Box>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        Không có thông tin hồ sơ điều trị.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary" variant="contained">
      Đóng
    </Button>
  </DialogActions>
</Dialog>




    </div>
  );
};

export default AnimalHistory;