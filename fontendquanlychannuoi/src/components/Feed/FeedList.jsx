import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, Box, Select, MenuItem, FormControl, InputLabel, Grid, Hidden } from "@mui/material";


const FeedList = () => {
    // State để lưu trữ dữ liệu feed và các thông tin phân trang
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState({
        foodType: "",
        userName: "",
        animalName: "",
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
    });

    // Hàm để gọi API và lấy danh sách Feed
    // Hàm để gọi API và lấy danh sách Feed
    const fetchFeeds = async (pageNumber = 1) => {
        setLoading(true);
        try {
           

            const { data, headers } = await axios.get("https://localhost:7185/api/DinhDuong", {
                params: {
                    foodType: search.foodType,
                    animalName: search.animalName,
                    pageNumber,
                    pageSize: pagination.pageSize,
                },
            });

           

            // Kiểm tra xem header "x-pagination" có tồn tại và có thể parse được không
            let paginationData = {};
            if (headers["x-pagination"]) {
                try {
                    paginationData = JSON.parse(headers["x-pagination"]);
                    
                } catch (error) {
                    
                }
            }

            setFeeds(data);
            setPagination({
                currentPage: paginationData.currentPage || 1,
                pageSize: paginationData.pageSize || 10,
                totalItems: paginationData.totalItems || 0,
                totalPages: paginationData.totalPages || 0,
            });

        } catch (error) {
            console.error("Error fetching feeds:", error);
        } finally {
            setLoading(false);
        }
    };
    const deleteFeed = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            setLoading(true);
            try {
                await axios.delete(`https://localhost:7185/api/DinhDuong/${id}`);
                fetchFeeds(pagination.currentPage);
            } catch (error) {
                console.error("Error deleting feed:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Hàm tìm kiếm
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearch((prevSearch) => ({ ...prevSearch, [name]: value }));
    };

    // Hàm để khi người dùng nhấn "Search" hoặc chuyển trang
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchFeeds(1);
    };

    const handlePageChange = (event, value) => {
        fetchFeeds(value);
    };

    // Gọi API lần đầu tiên khi component được render
    useEffect(() => {
        fetchFeeds();
    }, []);

    return (
        <Box sx={{ padding: 2, overflow:'Hidden'}}>
            <Typography variant="h4" gutterBottom>
                Danh sách thức ăn
            </Typography>

            {/* Form tìm kiếm */}
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2} sx={{ marginBottom: 2 }} component="form" onSubmit={handleSearchSubmit}>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            label="Tên vật nuôi"
                            variant="outlined"
                            name="animalName"
                            value={search.animalName}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Loại thức ăn</InputLabel>
                            <Select
                                label="Loại thức ăn"
                                name="foodType"
                                value={search.foodType}
                                onChange={handleSearchChange}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="Cỏ">Cỏ</MenuItem>
                                <MenuItem value="Ngũ cốc">Ngũ cốc</MenuItem>
                                <MenuItem value="Thức ăn chế biến sẵn">Thức ăn chế biến sẵn</MenuItem>
                                <MenuItem value="Thức ăn khác">Thức ăn khác</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"

                            disabled={loading}
                            sx={{ height: 55 }} // Cài đặt chiều cao của nút là 55px
                        >
                            Tìm kiếm
                        </Button>

                    </Grid>
                </Grid>
            </Box>

            {/* Hiển thị danh sách Feed */}
            {loading ? (
                <Typography variant="h6">Đang tải...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Ngày cho ăn</TableCell>
                                <TableCell>Loại thức ăn</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Chi phí</TableCell>
                                <TableCell>Ghi chú</TableCell>
                                <TableCell>Vật nuôi</TableCell>
                                <TableCell>Người dùng</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {feeds.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                feeds.map((feed) => (
                                    <TableRow key={feed.id}>
                                        <TableCell>{feed.id}</TableCell>
                                        <TableCell>{new Date(feed.feedingDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{feed.foodType}</TableCell>
                                        <TableCell>{feed.quantity}</TableCell>
                                        <TableCell>{feed.cost}</TableCell>
                                        <TableCell>{feed.notes}</TableCell>
                                        <TableCell>{feed.animalName}</TableCell>
                                        <TableCell>{feed.userName}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => deleteFeed(feed.id)}
                                                disabled={loading}
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Phân trang */}
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default FeedList;
