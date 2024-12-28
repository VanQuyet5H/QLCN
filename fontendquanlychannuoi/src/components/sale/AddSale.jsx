import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Stack, Alert, MenuItem, Select, InputLabel, FormControl, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSale = () => {
  const [form, setForm] = useState({
    animalId: '',
    animalName: '', // animalName will be updated based on animalId selection
    userId: '', // Ensure userId is included in the form
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
  const [userInfo, setUserInfo] = useState(null); // Store user info
  const navigate = useNavigate();
  const id = localStorage.getItem('id');

  // Fetch user info and set form.userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setForm((prevForm) => ({
        ...prevForm,
        userId: storedUserId // Update form with userId
      }));

      // Fetch user info to display the seller's name
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`https://localhost:7185/api/Auth/Profile`, {
            params: { id },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const { username } = response.data; // Assuming the API returns the username
          setUserInfo(username);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    } else {
      console.log('User ID not found in localStorage');
    }
  }, []);

  // Fetch animals from the API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/sale/layidvaten');
        setAnimals(response.data);
      } catch (err) {
        setError('Unable to fetch animal list');
      }
    };

    fetchAnimals();
  }, []);

  // Update form data based on user input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If animalId is changed, fetch the corresponding animalName
    if (name === 'animalId') {
      const selectedAnimal = animals.find((animal) => animal.id === value);
      setForm({
        ...form,
        animalId: value,
        animalName: selectedAnimal ? selectedAnimal.name : '', // Update animalName based on selected animal
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleReset = () => {
    setForm({
      animalId: '',
      userId: '',
      animalName:'',
      buyerName: '',
      price: '',
      quantity: '',
      saleDate: '',
      animalName: '', // Reset animalName as well
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedAnimal = animals.find((animal) => animal.id === form.animalId);
      const animalName = selectedAnimal ? selectedAnimal.name : '';
    
      // Gửi dữ liệu cùng với animalName
      const request = { ...form, animalName };
      const response = await axios.post('https://localhost:7185/api/sale', request);
      setSnackbarMessage('Transaction added successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setSnackbarMessage('An error occurred, please try again!');
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
        {/* Select box cho ID Vật Nuôi */}
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
          value={userInfo || 'Đang tải...'}
          fullWidth
          disabled
        />
  
        {/* Các trường nhập liệu khác */}
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
