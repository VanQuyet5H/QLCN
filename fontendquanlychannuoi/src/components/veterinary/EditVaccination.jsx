import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const EditVaccination = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [vaccination, setVaccination] = useState(location.state?.vaccination || {});
    const [open, setOpen] = useState(true);  // Điều khiển hiển thị modal
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
        navigate('/vaccinations');  // Quay lại trang danh sách khi đóng modal
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put(`https://localhost:7185/api/TiemChung/UpdateVaccination`, vaccination);
            setOpen(false);
            navigate('/vaccinations'); // Trở lại danh sách sau khi cập nhật
        } catch (error) {
            console.error('Error updating vaccination:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setVaccination({ ...vaccination, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                    Cập Nhật Thông Tin Tiêm Chủng
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 10 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ width: '100%',padding:2,scrollbarWidth:'none' }}>
                    <Grid container spacing={3}>
                        {/* Cột bên trái */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mã Vật Nuôi"
                                fullWidth
                                value={vaccination.animalId || ''}
                                onChange={handleInputChange}
                                name="animalId"
                                sx={{ mb: 2 }}
                                disabled
                            />
                            <TextField
                                label="Tên Vật Nuôi"
                                fullWidth
                                value={vaccination.animalName || ''}
                                onChange={handleInputChange}
                                name="animalName"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Loại Vật Nuôi"
                                fullWidth
                                value={vaccination.animalType || ''}
                                onChange={handleInputChange}
                                name="animalType"
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        {/* Cột bên phải */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Tên Vaccine"
                                fullWidth
                                value={vaccination.vaccineName || ''}
                                onChange={handleInputChange}
                                name="vaccineName"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Ngày Tiêm"
                                fullWidth
                                type="date"
                                value={vaccination.vaccinationDate ? new Date(vaccination.vaccinationDate).toISOString().split('T')[0] : ''}
                                onChange={handleInputChange}
                                name="vaccinationDate"
                                sx={{
                                    mb: 2,               // Margin bottom
                                    minWidth: '220px',   // Đặt min-width là 420px
                                    height: '60px',      // Đặt chiều cao là 60px
                                    '& input': {
                                      height: '60px',
                                      minWidth: '220px',    // Đảm bảo chiều cao của input không bị thu hẹp
                                    },
                                  }}  // Thêm minWidth
                            />

                            <TextField
                                label="Trạng Thái"
                                fullWidth
                                value={vaccination.status || ''}
                                onChange={handleInputChange}
                                name="status"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ghi Chú"
                                fullWidth
                                value={vaccination.note || ''}
                                onChange={handleInputChange}
                                name="note"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ borderRadius: 1, textTransform: 'none' }}
                    disabled={loading}
                >
                    {loading ? 'Đang Cập Nhật...' : 'Lưu Cập Nhật'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditVaccination;
