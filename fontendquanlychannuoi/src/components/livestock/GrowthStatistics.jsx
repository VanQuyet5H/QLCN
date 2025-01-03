import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Fade,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { BarChart, ErrorOutline } from '@mui/icons-material';
ChartJS.register(CategoryScale, LinearScale,BarChart,BarElement, Title, Tooltip, Legend);

const API_URL = "https://localhost:7185/api/QualityControl/tang-truong";

const GrowthStatistics = () => {
  const [day, setDay] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    vatNuoiTangTruongTot: [],
    vatNuoiTangTruongKem: [],
    phanTichChiTiet: [],
  });

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}?ngay=${day}`);
      if (response.status === 200 && response.data) {
        setData({
          vatNuoiTangTruongTot: response.data.vatNuoiTangTruongTot || [],
          vatNuoiTangTruongKem: response.data.vatNuoiTangTruongKem || [],
          phanTichChiTiet: response.data.phanTichChiTiet || [],
        });
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [day]);

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const chartData = {
    labels: data.phanTichChiTiet.map((pt) => `${pt.loaiVatNuoi} - ${pt.giong}`),
    datasets: [
      {
        label: "Tăng trưởng tốt (%)",
        data: data.phanTichChiTiet.map((pt) =>
          pt.trangThai === "Tăng trưởng tốt" ? pt.tiLeTangTruongTB : 0
        ),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tăng trưởng kém (%)",
        data: data.phanTichChiTiet.map((pt) =>
          pt.trangThai === "Tăng trưởng kém" ? pt.tiLeTangTruongTB : 0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "grey.50", minHeight: "100vh" }}>
      {error && (
        <Fade in={!!error}>
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => setError("")}>
                Đóng
              </Button>
            }
            icon={<ErrorOutline />} // Adding error icon
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Thống Kê Tăng Trưởng Vật Nuôi
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <TextField
              type="number"
              value={day}
              onChange={handleDayChange}
              label="Số Ngày Phân Tích"
              size="small"
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              onClick={fetchGrowthData}
              sx={{ px: 4 }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : <BarChart />} // Adding icon to button
            >
              {loading ? 'Đang Tải...' : 'Xem Thống Kê'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}><BarChart sx={{ mr: 1 }} />Biểu đồ Tăng Trưởng</Typography>
            <Bar data={chartData} options={chartOptions} />
          </Box>

          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Vật Nuôi Tăng Trưởng Tốt
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại Vật Nuôi</TableCell>
                      <TableCell>Giống</TableCell>
                      <TableCell>Tỷ Lệ Tăng Trưởng</TableCell>
                      <TableCell>Tổng Số</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.vatNuoiTangTruongTot.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.loaiVatNuoi}</TableCell>
                        <TableCell>{item.giong}</TableCell>
                        <TableCell>{item.tiLeTangTruong}%</TableCell>
                        <TableCell>{item.tongSoVatNuoi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Vật Nuôi Tăng Trưởng Kém
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại Vật Nuôi</TableCell>
                      <TableCell>Giống</TableCell>
                      <TableCell>Tỷ Lệ Tăng Trưởng</TableCell>
                      <TableCell>Tổng Số</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.vatNuoiTangTruongKem.length > 0 ? (
                      data.vatNuoiTangTruongKem.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.loaiVatNuoi}</TableCell>
                          <TableCell>{item.giong}</TableCell>
                          <TableCell>{item.tiLeTangTruong}%</TableCell>
                          <TableCell>{item.tongSoVatNuoi}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Không có dữ liệu tăng trưởng kém.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          {data.phanTichChiTiet.map((pt, idx) => (
            <Card key={idx} sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Phân Tích Chi Tiết: {pt.loaiVatNuoi} - {pt.giong}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Tỷ Lệ Tăng Trưởng Trung Bình: {pt.tiLeTangTruongTB}%
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Trạng Thái: {pt.trangThai}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Tổng Số Vật Nuôi: {pt.tongSoVatNuoi}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Vật Nuôi Tốt Nhất
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã Vật Nuôi</TableCell>
                        <TableCell>Tỷ Lệ Tăng Trưởng (%)</TableCell>
                        <TableCell>Cân Nặng Ban Đầu</TableCell>
                        <TableCell>Cân Nặng Hiện Tại</TableCell>
                        <TableCell>Số Ngày</TableCell>
                        <TableCell>Số Lần Kiểm Tra</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pt.vatNuoiTotNhat.map((vn, vnIdx) => (
                        <TableRow key={vnIdx}>
                          <TableCell>{vn.maVatNuoi}</TableCell>
                          <TableCell>{vn.tiLeTangTruong.toFixed(2)}</TableCell>
                          <TableCell>{vn.canNangBanDau}</TableCell>
                          <TableCell>{vn.canNangHienTai}</TableCell>
                          <TableCell>{vn.soNgay}</TableCell>
                          <TableCell>{vn.soLanKiemTra}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Vật Nuôi Kém Nhất
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã Vật Nuôi</TableCell>
                        <TableCell>Tỷ Lệ Tăng Trưởng (%)</TableCell>
                        <TableCell>Cân Nặng Ban Đầu</TableCell>
                        <TableCell>Cân Nặng Hiện Tại</TableCell>
                        <TableCell>Số Ngày</TableCell>
                        <TableCell>Số Lần Kiểm Tra</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pt.vatNuoiKemNhat.map((vn, vnIdx) => (
                        <TableRow key={vnIdx}>
                          <TableCell>{vn.maVatNuoi}</TableCell>
                          <TableCell>{vn.tiLeTangTruong.toFixed(2)}</TableCell>
                          <TableCell>{vn.canNangBanDau}</TableCell>
                          <TableCell>{vn.canNangHienTai}</TableCell>
                          <TableCell>{vn.soNgay}</TableCell>
                          <TableCell>{vn.soLanKiemTra}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
};

export default GrowthStatistics;
