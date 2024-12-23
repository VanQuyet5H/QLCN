import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TextField, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreateCage from './CreateCage';  // Import CreateCage component
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // Import icon for delete action

const CageList = () => {
  const [cages, setCages] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [ascending, setAscending] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cageToDelete, setCageToDelete] = useState(null);

  const handleAddCage = () => {
    setOpenModal(true);  // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Close the modal
  };

  const fetchCages = async () => {
    try {
      const response = await axios.get("https://localhost:7185/api/Cage", {
        params: {
          pageNumber: page,
          pageSize: pageSize,
          searchTerm: searchTerm,
          sortBy: sortBy,
          ascending: ascending
        }
      });


      const data = response.data;
      setCages(data.cages); // Cập nhật mảng chuồng
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching cages:", error);
    }
  };

  useEffect(() => {
    fetchCages();
  }, [page, pageSize, searchTerm, sortBy, ascending]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (field) => {
    setSortBy(field);
    setAscending(!ascending);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);  // Reset to first page when page size changes
  };

  // Hàm xử lý khi nhấn xóa chuồng
  const handleDeleteCage = async () => {
    try {
      if (!cageToDelete) return;
  
      console.log("Chuồng cần xóa: ", cageToDelete); // Log thông tin chuồng cần xóa
  
      // Gọi API kiểm tra vật nuôi trong chuồng
      const response = await axios.get(`https://localhost:7185/api/Cage/CheckAnimalsInCage?tenChuong=${cageToDelete.name}`);
      const { hasAnimals } = response.data;
  
      console.log("Kết quả kiểm tra vật nuôi: ", hasAnimals); // Log kết quả kiểm tra vật nuôi
  
      if (hasAnimals) {
        // Nếu có vật nuôi, hỏi người dùng có muốn chuyển vật nuôi sang chuồng khác không
        const confirmSwitch = window.confirm(
          `Chuồng này có vật nuôi. Bạn có muốn chuyển chúng sang chuồng khác trước khi xóa không?`
        );
  
        if (confirmSwitch) {
          // Chuyển hướng người dùng sang trang danh sách vật nuôi để thực hiện chuyển chuồng
          console.log("Chuyển hướng người dùng sang trang danh sách vật nuôi");
          window.location.href = `/livestockdashdoard`;
        } else {
          console.log("Người dùng không muốn chuyển vật nuôi. Đóng hộp thoại.");
          setDeleteDialogOpen(false);
          return;
        }
      } else {
        // Xóa chuồng nếu không có vật nuôi
        console.log(`Xóa chuồng "${cageToDelete.name}"`);
        await axios.delete(`https://localhost:7185/api/Cage/${cageToDelete.id}`);
        
        alert(`Chuồng "${cageToDelete.name}" đã được xóa!`);
        console.log("Cập nhật lại danh sách chuồng.");
        fetchCages(); // Cập nhật lại danh sách chuồng
        setDeleteDialogOpen(false);  // Đóng hộp thoại sau khi xóa thành công
      }
    } catch (error) {
      console.error("Error deleting cage:", error);
      alert("Có lỗi xảy ra khi xóa chuồng!");
      setDeleteDialogOpen(false);  // Đóng hộp thoại nếu có lỗi
    }
  };
  

  const handleDeleteDialogOpen = (cage) => {
    setCageToDelete(cage);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCageToDelete(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Quản lý Chuồng
      </Typography>

      {/* Modal thêm chuồng */}
      <Dialog open={openModal} onClose={handleCloseModal} sx={{
        '& .MuiDialog-paper': {
          maxHeight: '90vh', // Giới hạn chiều cao modal
          overflow: 'hidden', // Loại bỏ cuộn
          padding: '16px', // Đảm bảo nội dung có khoảng cách hợp lý
        },
      }} >
        <DialogContent sx={{
          padding: 0, // Loại bỏ padding dư thừa nếu cần
          overflow: 'hidden', // Đảm bảo không xuất hiện thanh cuộn
        }}>
          <CreateCage /> {/* Add the CreateCage component inside the modal */}
        </DialogContent>
        <DialogActions sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 20,
              zIndex: 2, // Ensure the icon is always above content
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Xóa chuồng */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xóa Chuồng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chuồng "{cageToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Hủy</Button>
          <Button onClick={handleDeleteCage} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên chuồng"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="sort-label">Sắp xếp theo</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sắp xếp theo"
            >
              <MenuItem value="Name">Tên chuồng</MenuItem>
              <MenuItem value="Capacity">Sức chứa</MenuItem>
              <MenuItem value="CurrentOccupancy">Số vật nuôi hiện tại</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số thứ tự</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "Name"}
                  direction={ascending ? "asc" : "desc"}
                  onClick={() => handleSortChange("Name")}
                >
                  Tên chuồng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "Capacity"}
                  direction={ascending ? "asc" : "desc"}
                  onClick={() => handleSortChange("Capacity")}
                >
                  Sức chứa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "CurrentOccupancy"}
                  direction={ascending ? "asc" : "desc"}
                  onClick={() => handleSortChange("CurrentOccupancy")}
                >
                  Số vật nuôi
                </TableSortLabel>
              </TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(cages) && cages.length > 0 ? (
              cages.map((cage, index) => (
                <TableRow key={cage.id}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell> {/* Số thứ tự */}
                  <TableCell>{cage.name}</TableCell>
                  <TableCell>{cage.capacity}</TableCell>
                  <TableCell>{cage.currentOccupancy}</TableCell>
                  <TableCell>
                    {cage.currentOccupancy === cage.capacity ? "Đầy" : "Còn chỗ"}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteDialogOpen(cage)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Pagination
          count={Math.ceil(totalItems / pageSize)}
          page={page}
          onChange={handlePageChange}
        />
        <FormControl>
          <InputLabel id="page-size-label">Số mục mỗi trang</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>
      
    </div>
  );
};

export default CageList;
