import React, { useState, useEffect, useMemo } from "react";
import {
  Grid, Typography, Box, Card, CardContent, Paper, TextField, Button, Container, Link, Stack, AppBar, Toolbar, InputAdornment, TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination
} from "@mui/material";
import { FaHorse, FaPiggyBank, FaExclamationTriangle, FaThermometerHalf, FaWater, FaWeight } from "react-icons/fa";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Bar as ChartJSBar } from "react-chartjs-2";
import MenuIcon from '@mui/icons-material/Menu';
import axios from "axios";
import "./Dashboard.css";
import SearchIcon from "@mui/icons-material/Search";

function Dashboard() {
  // State management
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedConsumptionData, setFeedConsumptionData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [animals, setAnimals] = useState([]);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://localhost:7185/api/Dashboard`, {
          params: {
            startDate: startDate,
            endDate: endDate,
            searchQuery: searchQuery,
            pageNumber: page,
            pageSize: rowsPerPage,
          },
        });
        setAnimals(response.data.items);
        setTotalAnimals(response.data.totalCount); // Set total count from response
      } catch (err) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [page, startDate, endDate, searchQuery]);

  // Memoized values
  const icons = useMemo(() => [
    <FaHorse />,
    <FaPiggyBank />,
    <FaWeight />,
    <FaExclamationTriangle />
  ], []);

  const environmentStats = useMemo(() => [
    { icon: <FaThermometerHalf />, title: "Nhiệt độ", value: "25°C", status: "normal" },
    { icon: <FaWater />, title: "Độ ẩm", value: "65%", status: "warning" },
  ], []);

  // API calls
  const fetchApi = async (url, params = {}, method = 'GET') => {
    try {
      const response = await axios({ method, url, data: params });
      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error("API call failed:", error);
      return [];
    }
  };

  // Data loading functions
  const loadGrowthData = async () => {
    setLoading(true);
    const data = await fetchApi(
      "https://localhost:7185/api/Dashboard/AnimalByMonthGrouped",
      { startDate, endDate },
      'POST'
    );
    
    if (data?.length > 0) {
      const months = [...new Set(data.map(item => item.month))];
      const animalTypes = [...new Set(data.map(item => item.animalType))];

      const datasets = animalTypes.map(type => ({
        label: type,
        data: months.map(month =>
          data.find(item => item.month === month && item.animalType === type)?.total || 0
        ),
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      }));

      setChartData({ labels: months, datasets });
    } else {
      setChartData(null);
    }
    setLoading(false);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const loadFeedConsumptionData = async () => {
    setLoading(true);
    const feedData = await fetchApi(
      "https://localhost:7185/api/Dashboard/weekly",
      { year },
      'POST'
    );

    if (feedData?.length > 0) {
      const formattedData = feedData
        .map(item => ({
          name: item.name,
          thức_ăn: item.totalQuantity,
        }))
        .sort((a, b) => parseInt(a.name.replace("Tuần ", "")) - parseInt(b.name.replace("Tuần ", "")));
      setFeedConsumptionData(formattedData);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const data = await fetchApi("https://localhost:7185/api/Dashboard/dashboard/summary");
    if (data) {
      setStats([
        {
          icon: <FaHorse />,
          title: "Tổng số vật nuôi",
          value: data.totalAnimals,
          trend: "Tăng",
          details: "Số vật nuôi trong hệ thống",
        },
        {
          icon: <FaExclamationTriangle />,
          title: "Số lượng vật nuôi bị ốm",
          value: data.sickAnimals,
          trend: "Cảnh báo",
          details: "Vật nuôi cần được chăm sóc đặc biệt",
        },
        {
          icon: <FaWater />,
          title: "Tổng lượng thức ăn",
          value: data.totalFeed,
          trend: "Dự báo",
          details: "Lượng thức ăn tiêu thụ trong tháng",
        },
        {
          icon: <FaPiggyBank />,
          title: "Tổng thu nhập từ bán hàng",
          value: data.totalRevenue,
          trend: "Lợi nhuận",
          details: "Doanh thu từ bán vật nuôi và sản phẩm",
        },
        {
          icon: <FaThermometerHalf />,
          title: "Số lượng tiêm chủng",
          value: data.vaccinationCount,
          trend: "Tiến độ",
          details: "Số lượng tiêm phòng đã thực hiện",
        },
      ]);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchStats();
    loadGrowthData();
    loadFeedConsumptionData();

  }, [startDate, endDate, year]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, marginTop: '50px',scrollbarWidth:'none' }}>
        {/* Header */}
        <Grid container alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={8}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              Hệ Thống Quản lý Chăn nuôi
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: '100%', maxWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2, fontSize: 28, color: 'primary.main' }}>{stat.icon}</Box>
                    <Typography variant="h6">{stat.title}</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.trend}
                  </Typography>
                  <Button sx={{ mt: 1 }}>
                    Xem thêm
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Growth Chart */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tăng trưởng đàn vật nuôi
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  type="date"
                  label="Từ ngày"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ width: 150 }}
                />
                <TextField
                  type="date"
                  label="Đến ngày"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ width: 150 }}
                />
              </Box>
              <Box sx={{ height: 300 }}>
                {chartData && <ChartJSBar data={chartData} options={{ maintainAspectRatio: false }} />}
              </Box>
            </Paper>
          </Grid>

          {/* Feed Consumption Chart */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tiêu thụ thức ăn
              </Typography>
              <TextField
                type="number"
                label="Năm"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ width: 150, mb: 3 }}
              />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={feedConsumptionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="thức_ăn" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Animal Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Báo cáo chi tiết
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Typography>Từ ngày:</Typography>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography>Đến ngày:</Typography>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Vật Nuôi</TableCell>
                    <TableCell align="right">Ngày Sinh</TableCell>
                    <TableCell align="right">Cân Nặng Hiện Tại (kg)</TableCell>
                    <TableCell align="right">Tăng Cân Mỗi Ngày Trung Bình (kg)</TableCell>
                    <TableCell align="right">Tổng Lượng Thức Ăn Đã Tiêu Thụ (kg)</TableCell>
                    <TableCell align="right">Tổng Calorie Đã Tiêu Thụ</TableCell>
                    <TableCell align="right">Trạng Thái Sức Khỏe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {animals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
                    </TableRow>
                  ) : (
                    animals.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.tenVatNuoi}</TableCell>
                        <TableCell align="right">{new Date(row.ngaySinh).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{row.canNangHienTai}</TableCell>
                        <TableCell align="right">{row.tangCanMoiNgayTrungBinh}</TableCell>
                        <TableCell align="right">{row.tongLuongThucAnDaTieuThu}</TableCell>
                        <TableCell align="right">{row.tongCalorieDaTieuThu}</TableCell>
                        <TableCell align="right">{row.trangThaiSucKhoe}</TableCell>
                      </TableRow>
                    ))
                  )}

                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(animals.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </Paper>
        </Grid>
        <Box sx={{
          mt: 4,
          pt: 3,
          pb: 3,
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Hệ thống Quản lý Chăn nuôi
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                {['Hướng dẫn', 'Chính sách', 'Hỗ trợ'].map((text) => (
                  <Grid item key={text}>
                    <Link
                      href="#"
                      color="inherit"
                      underline="hover"
                      sx={{
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {text}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
