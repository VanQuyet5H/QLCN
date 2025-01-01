import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { FaSave, FaTimes } from 'react-icons/fa';

function EditLivestock({ livestock, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: '',
    gender: '',
    birthDate: '',
    status: '',
    weight: '',
    breed: '',
    otherType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (livestock) {
      setFormData({
        ...livestock,
        type: ['Gia cầm','Gia súc','Khác'].includes(livestock.type) ? livestock.type : '',
        otherType: livestock.type === 'Khác' ? livestock.otherType : '',
        birthDate: livestock.birthDate ? livestock.birthDate.split('T')[0] : '',
      });
    }
  }, [livestock]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên vật nuôi';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại vật nuôi';
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Cân nặng không hợp lệ';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng nhập ngày sinh';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const finalData = formData.type === 'other' ? { ...formData, type: formData.otherType } : formData;
      try {
        await onSubmit(finalData);
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error updating livestock:', error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 4, border: '1px solid #ccc', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Chỉnh sửa thông tin vật nuôi
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Mã số vật nuôi"
              name="id"
              value={formData.id}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên vật nuôi *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Loại vật nuôi *</InputLabel>
              <Select
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
              >
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="Gia súc">Gia súc</MenuItem>
                <MenuItem value="Gia cầm">Gia cầm</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.type === 'other' && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nhập loại khác"
                name="otherType"
                value={formData.otherType || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Đực">Đực</MenuItem>
                <MenuItem value="Cái">Cái</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày sinh *"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.birthDate}
              helperText={errors.birthDate}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cân nặng (kg) *"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              error={!!errors.weight}
              helperText={errors.weight}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Giống"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tình trạng"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              startIcon={<FaTimes />}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default EditLivestock;
