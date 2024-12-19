import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const GetCage = () => {
    const [cageId, setCageId] = useState('');
    const [cageData, setCageData] = useState(null);
    const [error, setError] = useState(null);

    const handleFetch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/Cage/ThongTinChuong/${cageId}`);
            setCageData(response.data);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu chuồng');
            setCageData(null);
        }
    };

    return (
        <div>
            <h2>Lấy Thông Tin Chuồng</h2>

            <TextField
                fullWidth
                label="Nhập ID Chuồng"
                variant="outlined"
                value={cageId}
                onChange={(e) => setCageId(e.target.value)}
                type="number"
                sx={{ marginBottom: 2 }}
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleFetch} 
                sx={{ marginBottom: 2 }}
            >
                Lấy Thông Tin
            </Button>

            {error && <Alert severity="error">{error}</Alert>}

            {cageData && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên Chuồng</TableCell>
                                <TableCell>Loại Vật Nuôi</TableCell>
                                <TableCell>Diện Tích</TableCell>
                                <TableCell>Sức Chứa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{cageData.id}</TableCell>
                                <TableCell>{cageData.name}</TableCell>
                                <TableCell>{cageData.animalType}</TableCell>
                                <TableCell>{cageData.area}</TableCell>
                                <TableCell>{cageData.capacity}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default GetCage;
