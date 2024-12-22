import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TextField, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CreateCage from './CreateCage';  // Import CreateCage component
import CloseIcon from '@mui/icons-material/Close';
const CageList = () => {
  const [cages, setCages] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [ascending, setAscending] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal] = useState(false);
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

      console.log("API Response:", response.data); // In ra toàn bộ dữ liệu trả về

      const data = response.data;
      // Sử dụng đúng trường 'cages' từ API
      setCages(data.cages); // Cập nhật mảng chuồng

      // Kiểm tra nếu TotalItems tồn tại và đặt tổng số mục
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

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Quản lý Chuồng
      </Typography>
      

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
                  <TableCell>{cage.status || "Hoạt động"}</TableCell> {/* Trạng thái */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </TableCell>
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