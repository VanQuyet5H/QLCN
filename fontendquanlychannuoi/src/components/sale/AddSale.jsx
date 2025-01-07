import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import axios from 'axios';

const AddSale = () => {
  const [form, setForm] = useState({
    userId: 0,
    buyerName: '',
    saleDate: '',
    animals: [],
  });

  const [animalList, setAnimalList] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
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

  useEffect(() => {
    // Fetch danh sách vật nuôi
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/sale/layidvaten');
        setAnimalList(response.data); // Giả định API trả về danh sách [{ id, name }]
      } catch (error) {
        setSnackbarMessage('Không thể tải danh sách vật nuôi.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    fetchAnimals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
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

  const handleAnimalSelect = (e, animalName) => {
    const isChecked = e.target.checked;

    setForm((prevForm) => {
      const updatedAnimals = isChecked
        ? [...prevForm.animals, { animalName, quantity: 1, price: 0 }]
        : prevForm.animals.filter((animal) => animal.animalName !== animalName);

      return { ...prevForm, animals: updatedAnimals };
    });
  };

  const handleQuantityChange = (animalName, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);

  // Đảm bảo số lượng không âm
  if (parsedQuantity < 0) {
    setSnackbarMessage(`Số lượng cho "${animalName}" không được nhỏ hơn 0.`);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }

    setForm((prevForm) => {
      const updatedAnimals = prevForm.animals.map((animal) =>
        animal.animalName === animalName
          ? { ...animal, quantity: parseInt(quantity, 10) }
          : animal
      );
      return { ...prevForm, animals: updatedAnimals };
    });
  };

  const handlePriceChange = (animalName, price) => {
    const parsedPrice = parseFloat(price);

  // Đảm bảo giá không âm
  if (parsedPrice < 0) {
    setSnackbarMessage(`Giá cho "${animalName}" không được nhỏ hơn 0.`);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }
    setForm((prevForm) => {
      const updatedAnimals = prevForm.animals.map((animal) =>
        animal.animalName === animalName
          ? { ...animal, price: parseFloat(price) }
          : animal
      );
      return { ...prevForm, animals: updatedAnimals };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra số lượng vật nuôi
    for (const animal of form.animals) {
      if (animal.quantity <= 0 || isNaN(animal.quantity)) {
        setSnackbarMessage(`Số lượng vật nuôi "${animal.animalName}" phải lớn hơn 0.`);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
    }
  
    try {
      // Gửi dữ liệu lên API
      const response = await axios.post('https://localhost:7185/api/sale', form);
  
      // Nếu không có lỗi thì thông báo thành công
      setSnackbarMessage('Thêm giao dịch thành công!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setForm({
        userId: 0,
        buyerName: '',
        saleDate: '',
        animals: [],
      });
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
  
      // Kiểm tra lỗi trả về từ API
      if (error.response && error.response.data && error.response.data.message) {
        // Hiển thị thông báo lỗi từ API
        setSnackbarMessage(error.response.data.message);
      } else {
        // Nếu không có thông báo chi tiết từ API, hiển thị thông báo chung
        setSnackbarMessage('Có lỗi xảy ra khi thêm giao dịch!');
      }
  
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: 3, mt: 2, boxShadow: 2, bgcolor: 'white' }}>
      <Typography variant="h5" style={{ marginBottom: 20 }}>
        Thêm Giao Dịch Mới
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
            name="saleDate"
            label="Ngày Giao Dịch"
            type="datetime-local"
            value={form.saleDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <Typography variant="h6">Chọn Vật Nuôi:</Typography>
          {animalList.map((animal) => (
            <FormControlLabel
              key={animal.name}
              control={
                <Checkbox
                  onChange={(e) => handleAnimalSelect(e, animal.name)}
                />
              }
              label={animal.name}
            />
          ))}
          {form.animals.map((animal) => (
            <Box key={animal.animalName} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{animal.animalName}</Typography>
              <TextField
                label="Số Lượng"
                type="number"
                value={animal.quantity}
                onChange={(e) => handleQuantityChange(animal.animalName, e.target.value)}
                fullWidth
                required
                sx={{ mb: 1 }}
              />
              <TextField
                label="Giá"
                type="number"
                value={animal.price}
                onChange={(e) => handlePriceChange(animal.animalName, e.target.value)}
                fullWidth
                required
              />
            </Box>
          ))}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button type="submit" variant="contained" color="primary">
              Lưu
            </Button>
          </Stack>
        </Stack>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSale;
