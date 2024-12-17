import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const AddMedication = ({ onAddMedication, open, handleClose }) => {
  const [medication, setMedication] = useState({
    name: '',
    description: '',
    unit: '',
    cost: '',
    quantity: '',
    minimumQuantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedication((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7185/api/Medication/AddMedication', medication);
      alert(response.data.message);  // Hiển thị thông báo thành công
      onAddMedication();  // Cập nhật danh sách thuốc sau khi thêm
      setMedication({
        name: '',
        description: '',
        unit: '',
        cost: '',
        quantity: '',
        minimumQuantity: ''
      });  
      handleClose();  // Đóng popup sau khi thêm thành công
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm Thuốc</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên Thuốc"
                name="name"
                value={medication.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô Tả"
                name="description"
                value={medication.description}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Đơn Vị"
                name="unit"
                value={medication.unit}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá (đồng)"
                name="cost"
                type="number"
                value={medication.cost}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số Lượng"
                name="quantity"
                type="number"
                value={medication.quantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mức Tồn Kho Tối Thiểu"
                name="minimumQuantity"
                type="number"
                value={medication.minimumQuantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Thêm Thuốc
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMedication;
