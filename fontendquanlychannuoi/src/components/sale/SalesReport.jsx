import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const SalesReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState([]);
    const [error, setError] = useState('');

    const fetchReport = async () => {
        try {
            const response = await axios.get('https://localhost:7185/api/Sale/sales-report', {
                params: { startDate, endDate },
            });
            console.log('apireport', response.data);
            setReport(response.data);
            setError('');
        } catch (err) {
            setError('Không thể lấy báo cáo, vui lòng thử lại.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchReport();
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
            <Typography variant="h5" style={{ marginBottom: 20 }}>Báo Cáo Doanh Thu</Typography>
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
                    <Button type="submit" variant="contained" color="primary">Xem Báo Cáo</Button>
                </Stack>
            </form>

            {error && <Typography color="error">{error}</Typography>}

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
                        {Array.isArray(report) && report.length > 0 ? (
                            report.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.month || 'N/A'}</TableCell>
                                    <TableCell>{row.year || 'N/A'}</TableCell>
                                    <TableCell>{row.totalSales ? row.totalSales.toLocaleString() : '0'} VND</TableCell>
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
        </Paper>
    );
};

export default SalesReport;
