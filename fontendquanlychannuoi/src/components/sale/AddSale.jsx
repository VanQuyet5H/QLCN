import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Stack, Alert, MenuItem, Select, InputLabel, FormControl, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSale = () => {
  const [form, setForm] = useState({
    animalId: '',
    userId: '', // Đảm bảo userId được đưa vào form
    buyerName: '',
    price: '',
    quantity: '',
    saleDate: '',
  });

  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null); // Lưu thông tin người dùng
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  useEffect(() => {
    // Lấy userId từ localStorage khi component load
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setForm((prevForm) => ({
        ...prevForm,
        userId: storedUserId // Cập nhật userId vào form
      }));
      // Lấy thông tin người dùng từ API để hiển thị tên người bán
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`https://localhost:7185/api/Auth/Profile`, {
            params: { id },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const { username } = response.data; // Giả sử API trả về username
          setUserInfo(username);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    } else {
      console.log('Không tìm thấy userId trong localStorage');
    }
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/sale/layidvaten');
        setAnimals(response.data);
      } catch (err) {
        setError('Không thể lấy danh sách vật nuôi');
      }
    };

    fetchAnimals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleReset = () => {
    setForm({
      animalId: '',
      userId: '',
      buyerName: '',
      price: '',
      quantity: '',
      saleDate: '',
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7185/api/sale', form);
      setSnackbarMessage('Giao dịch đã được thêm thành công!');
      setOpenSnackbar(true);
      
    } catch (error) {
      console.error('Có lỗi khi thêm giao dịch:', error);
      setSnackbarMessage('Có lỗi xảy ra, vui lòng thử lại!');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" style={{ marginBottom: 20 }}>Thêm Mới Giao Dịch</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>

          {/* Select box cho ID vật nuôi */}
          <FormControl fullWidth>
            <InputLabel id="animalId-label">ID Vật Nuôi</InputLabel>
            <Select
              labelId="animalId-label"
              name="animalId"
              value={form.animalId}
              onChange={handleChange}
              label="ID Vật Nuôi"
            >
              {animals.map((animal) => (
                <MenuItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Hiển thị tên người bán */}
          <TextField
            label="Người Bán"
            value={userInfo || 'Loading...'}
            fullWidth
            disabled
          />

          <TextField
            name="buyerName"
            label="Tên Người Mua"
            value={form.buyerName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="price"
            label="Giá"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="quantity"
            label="Số Lượng"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="saleDate"
            label="Ngày Giao Dịch"
            type="date"
            value={form.saleDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button type="submit" variant="contained" color="primary">
              Gửi
            </Button>
            <Button variant="contained" color="secondary" onClick={handleReset}>
              Hủy
            </Button>
          </Stack>
        </Stack>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddSale;
