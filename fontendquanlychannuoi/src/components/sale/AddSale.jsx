import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Stack, Alert, MenuItem, Select, InputLabel, FormControl, Snackbar, AlertTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSale = () => {
  const [form, setForm] = useState({
    animalId: '',
    animalName: '',
    userId: '',
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
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Added to control Snackbar color
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const id = localStorage.getItem('id');

  // Fetch user info and set form.userId
  useEffect(() => {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setForm((prevForm) => ({
        ...prevForm,
        userId: storedUserId,
      }));

      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`https://localhost:7185/api/Auth/Profile`, {
            params: { id },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const { username } = response.data;
          setUserInfo(username);
        } catch (error) {
          setError('Không thể tải thông tin người dùng.');
        }
      };
      fetchUserInfo();
    }
  }, []);

  // Fetch animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/sale/layidvaten');
        setAnimals(response.data);
      } catch (err) {
        setError('Không thể tải danh sách vật nuôi.');
      }
    };
    fetchAnimals();
  }, []);

  // Check animal quantity
  const checkAnimalQuantity = async (animalId) => {
    try {
      const response = await axios.get(`https://localhost:7185/api/Sale/CheckAnimalQuantity/${animalId}`);
      const quantity = response.data;

      if (quantity <= 0) {
        setSnackbarMessage('Số lượng vật nuôi không đủ.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return false;
      }
      return quantity; // Số lượng hợp lệ
    } catch (error) {
      console.error('Error checking animal quantity:', error);
      setSnackbarMessage('Có lỗi khi kiểm tra số lượng vật nuôi.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
  };

  // Handle form input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'animalId') {
      const selectedAnimal = animals.find((animal) => animal.id === value);
      setForm({
        ...form,
        animalId: value,
        animalName: selectedAnimal ? selectedAnimal.name : '',
      });

      // Kiểm tra số lượng vật nuôi sau khi chọn
      if (form.quantity) {
        const isValid = await checkAnimalQuantity(value);
        
        if (form.quantity>isValid) {
          // Nếu không đủ số lượng, reset lại số lượng và hiển thị thông báo
          setForm((prevForm) => ({ ...prevForm, quantity: '' }));
          alert(`Số vật nuôi trong chuông không đủ,còn lại: ${isValid} con`);
  
        }
      }
    } else {
      // Cập nhật giá trị form khi thay đổi các trường khác
      setForm({ ...form, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValidQuantity = await checkAnimalQuantity(form.animalId);
      
      if (parseInt(form.quantity, 10) > isValidQuantity) {
        setSnackbarMessage('Số lượng vật nuôi không đủ để bán.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      const response = await axios.post('https://localhost:7185/api/sale', form);
      setSnackbarMessage('Giao dịch được thêm thành công!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleReset();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setSnackbarMessage('Có lỗi xảy ra. Vui lòng thử lại!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleReset = () => {
    setForm({
      animalId: '',
      userId: '',
      animalName: '',
      buyerName: '',
      price: '',
      quantity: '',
      saleDate: '',
    });
    setError('');
    setSuccess('');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" style={{ marginBottom: 20 }}>Thêm Mới Giao Dịch</Typography>

      {error && (
        <Alert severity="error">
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="animalId-label">ID Vật Nuôi</InputLabel>
            <Select
              labelId="animalId-label"
              name="animalId"
              value={form.animalId}
              onChange={handleChange}
              label="ID Vật Nuôi"
              required
            >
              {animals.map((animal) => (
                <MenuItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Người Bán"
            value={userInfo || 'Đang tải...'}
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddSale;
