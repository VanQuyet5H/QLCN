import React, { useState, useEffect } from 'react';
import { TextField, Button,Box,Paper,Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState([]);
    const [error, setError] = useState('');
    const [totalReport, setTotalReport] = useState([]);
    const [animalReport, setAnimalReport] = useState([]);

    // Lấy ngày đầu và cuối của tháng trước
    const getLastMonthDateRange = () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Ngày đầu tháng hiện tại
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Ngày cuối tháng hiện tại
        return { startOfMonth, endOfMonth };
    };

    // Gọi API để lấy dữ liệu báo cáo
    const fetchReport = async (startDate, endDate) => {
        try {
            const response = await axios.get('https://localhost:7185/api/Sale/sales-report', {
                params: { startDate, endDate },
            });
            console.log('apireport', response.data);
            setTotalReport(response.data.totalReport); // Lưu lại dữ liệu báo cáo tổng
            setAnimalReport(response.data.animalReport); // Lưu lại báo cáo doanh thu từng vật nuôi
            setReport(response.data);
            setError('');
        } catch (err) {
            setError('Không thể lấy báo cáo, vui lòng thử lại.');
        }
    };

    // Khi component mount, tính toán ngày tháng mặc định
    useEffect(() => {
        const { startOfMonth, endOfMonth } = getLastMonthDateRange();
        setStartDate(startOfMonth.toISOString().split('T')[0]);
        setEndDate(endOfMonth.toISOString().split('T')[0]);

        // Gọi API để lấy dữ liệu của tháng gần nhất (hoặc khoảng thời gian mặc định)
        fetchReport(startOfMonth.toISOString().split('T')[0], endOfMonth.toISOString().split('T')[0]);
    }, []);

    // Xử lý sự kiện khi người dùng chọn ngày và nhấn nút
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchReport(startDate, endDate);
    };

    // Dữ liệu biểu đồ
    const chartData = {
        labels: animalReport.map((item) => item.animalName), // Các tên vật nuôi
        datasets: [
            {
                label: 'Doanh Thu',
                data: animalReport.map((item) => item.totalSales), // Doanh thu cho từng vật nuôi
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu sắc cho cột
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Tùy chọn cho biểu đồ
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Báo Cáo Doanh Thu Theo Vật Nuôi',
                font: {
                    size: 18,
                    weight: 'bold',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `${context.dataset.label}: ${value} VND`;
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tên Vật Nuôi',
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Doanh Thu (VND)',
                    font: {
                        size: 14,
                    },
                },
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString(); // Định dạng số
                    },
                },
            },
        },
    };

    return (
        <Box sx={{ p: 3, mt: 2, boxShadow: 2, bgcolor: 'white' }}>
            <Typography variant="h5" style={{ marginBottom: 20 }}>
                Báo Cáo Doanh Thu
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} marginBottom={3}>
                    <TextField
                        label="Từ ngày"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Xem Báo Cáo
                    </Button>
                </Stack>
            </form>

            {error && <Typography color="error">{error}</Typography>}

            <Typography variant="h6" style={{ marginTop: 20 }}>
                Báo Cáo Doanh Thu Theo Vật Nuôi
            </Typography>
            <div style={{ height: '300px', width: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Hiển thị báo cáo tổng doanh thu */}
            <Typography variant="h6" style={{ marginTop: 20 }}>
                Báo Cáo Tổng Doanh Thu
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tháng</TableCell>
                            <TableCell>Năm</TableCell>
                            <TableCell>Tổng Doanh Thu</TableCell>
                            <TableCell>Số Giao Dịch</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(totalReport) && totalReport.length > 0 ? (
                            totalReport.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.month || 'N/A'}</TableCell>
                                    <TableCell>{row.year || 'N/A'}</TableCell>
                                    <TableCell>
                                        {row.totalSales ? row.totalSales.toLocaleString() : '0'} VND
                                    </TableCell>
                                    <TableCell>{row.totalTransactions || 0}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    Không có dữ liệu để hiển thị.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SalesReport;
