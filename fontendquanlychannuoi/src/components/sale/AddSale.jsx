import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddSale = () => {
  const [form, setForm] = useState({
    animalId: '',
    buyerName: '',
    price: '',
    quantity: '',
    saleDate: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu đến API (giả lập)
    console.log('Dữ liệu đã gửi:', form);
    navigate('/');
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" style={{ marginBottom: 20 }}>Thêm Mới Giao Dịch</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="animalId"
            label="ID Vật Nuôi"
            value={form.animalId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="buyerName"
            label="Tên Người Mua"
            value={form.buyerName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="price"
            label="Giá"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="quantity"
            label="Số Lượng"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="saleDate"
            label="Ngày Giao Dịch"
            type="date"
            value={form.saleDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            
            <Button type="submit" variant="contained" color="primary">
              Gửi
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
              Hủy
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddSale;
