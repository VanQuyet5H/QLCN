import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './inputdate.css';
import Notification from '../utils/Notification';
const CreateCage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    area: '',
    location: '',
    capacity: '',
    currentOccupancy: '',
    isAvailable: true,
    maintenanceDate: '',
    notes: '',
    environmentalConditions: '',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('dulieu',formData);
      const response = await axios.post(`https://localhost:7185/api/Cage/NhapChuong`, formData);
      setNotification({ message: 'Thêm chuồng thành công!', type: 'success' });
      setFormData({
        name: '',
        purpose: '',
        area: '',
        location: '',
        capacity: '',
        currentOccupancy: '',
        isAvailable: true,
        maintenanceDate: '',
        notes: '',
        environmentalConditions: '',
      });
    } catch (error) {
      setNotification({ message: 'Thất bại!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton color="primary" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
          Nhập thông tin chuồng trại
        </Typography>
      </Box>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên chuồng"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Mục đích"
              variant="outlined"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Diện tích (m²)"
              variant="outlined"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Vị trí"
              variant="outlined"
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sức chứa"
              variant="outlined"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Số lượng hiện tại"
              variant="outlined"
              type="number"
              name="currentOccupancy"
              value={formData.currentOccupancy}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Ngày bảo trì"
              variant="outlined"
              type="date"
              name="maintenanceDate"
              value={formData.maintenanceDate}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: true, // Ensures the label is not floating when a value is selected
              }}
            />
            <TextField
              fullWidth
              label="Ghi chú"
              variant="outlined"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Điều kiện môi trường"
              variant="outlined"
              name="environmentalConditions"
              value={formData.environmentalConditions}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Thêm chuồng'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFormData({
                  name: '',
                  purpose: '',
                  area: '',
                  location: '',
                  capacity: '',
                  currentOccupancy: '',
                  isAvailable: true,
                  maintenanceDate: '',
                  notes: '',
                  environmentalConditions: '',
                })}
              >
                Hủy
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateCage;
