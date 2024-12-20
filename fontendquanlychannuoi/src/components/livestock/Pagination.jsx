import React, { useState, useEffect } from 'react';
import { Pagination, PaginationItem, Box, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

function PaginationComponent({ totalItems, currentPage, onPageChange, onRowsPerPageChange }) {
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Xử lý khi người dùng thay đổi trang
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  // Xử lý khi người dùng thay đổi số lượng hàng mỗi trang
  const handleRowsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    onRowsPerPageChange(event.target.value);
  };

  // Cập nhật lại trang khi thay đổi số lượng hàng mỗi trang
  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages); // Ensure we don't exceed the total number of pages
    }
  }, [itemsPerPage, totalPages, currentPage, onPageChange]);

  if (totalItems === 0) {
    return <div>Không có dữ liệu để hiển thị.</div>; // Thông báo khi không có dữ liệu
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
      {/* Dropdown for rows per page */}
      <Box display="flex" alignItems="center">
        <FormControl variant="outlined" size="small">
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={itemsPerPage}
            onChange={handleRowsPerPageChange}
            label="Rows per page"
          >
            {[10, 20, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Pagination Component */}
      <Box display="flex" alignItems="center">
        <Pagination
          count={totalPages} // Tổng số trang
          page={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Hàm thay đổi trang
          color="primary" // Màu sắc chính
          siblingCount={2} // Số trang hiển thị gần trang hiện tại
          boundaryCount={1} // Số trang hiển thị ở đầu/cuối danh sách
          aria-label="pagination" // Cải thiện khả năng truy cập
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={item.page === '...'} // Không cho phép nhấn vào các dấu "..."
            />
          )}
        />
      </Box>

      {/* Items display text */}
      <Box display="flex" alignItems="center">
        <Typography variant="body2">
          {`Hiển thị ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–${Math.min(
            currentPage * itemsPerPage,
            totalItems
          )} của ${totalItems} vật nuôi`}
        </Typography>
      </Box>
    </Box>
  );
}

export default PaginationComponent;
