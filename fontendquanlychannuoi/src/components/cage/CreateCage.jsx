import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import Notification from '../utils/Notification';

const CreateCage = () => {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    area: '',
    location: '',
    capacity: '',
    currentOccupancy: '',
    isAvailable: true,
    notes: '',
    environmentalConditions: '',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData({ ...formData, isAvailable: checked });
  };

  const validateForm = () => {
    const { name, area, capacity} = formData;

    if (!name.trim() || name.length > 50) {
      setNotification({ message: 'Tên chuồng phải từ 1 đến 50 ký tự!', type: 'error' });
      return false;
    }

    if (area <= 0 || isNaN(area)) {
      setNotification({ message: 'Diện tích phải là số dương!', type: 'error' });
      return false;
    }

    if (capacity <= 0 || isNaN(capacity)) {
      setNotification({ message: 'Sức chứa phải là số dương!', type: 'error' });
      return false;
    }

    

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const checkResponse = await axios.get(`https://localhost:7185/api/Cage/CheckCage?name=${formData.name}`);
    if (checkResponse.data.exists) {
      setNotification({ message: 'Chuồng đã tồn tại!', type: 'warning' });
      setLoading(false);
      return;
    }
      const response = await axios.post(`https://localhost:7185/api/Cage/NhapChuong`, formData);
      setNotification({ message: 'Thêm chuồng thành công!', type: 'success' });
      setFormData({
        name: '',
        purpose: '',
        area: '',
        location: '',
        capacity: '',
        isAvailable: true,
        notes: '',
        environmentalConditions: '',
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra khi thêm chuồng!';
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy nhập thông tin?')) {
      setFormData({
        name: '',
        purpose: '',
        area: '',
        location: '',
        capacity: '',
        isAvailable: true,
        notes: '',
        environmentalConditions: '',
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4, scrollbarWidth: 'none' }}>
      <Typography variant="h4" gutterBottom>
        Nhập thông tin chuồng trại
      </Typography>

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
              select
              fullWidth
              label="Mục đích"
              variant="outlined"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            >
              <MenuItem value="Nuôi giống">Nuôi giống</MenuItem>
              <MenuItem value="Lấy thịt">Lấy thịt</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </TextField>
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
              label="Vị trí"
              variant="outlined"
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Điều kiện môi trường"
              variant="outlined"
              name="environmentalConditions"
              value={formData.environmentalConditions}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12} >
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAvailable}
                  onChange={handleCheckboxChange}
                />
              }
              label="Chuồng có sẵn"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Thêm chuồng'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
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
