import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, MenuItem, Select, InputLabel, FormControl, Typography, FormHelperText, IconButton } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const VaccinationForm = () => {
  const [animals, setAnimals] = useState([]); // Danh sách vật nuôi
  const [vaccinationData, setVaccinationData] = useState({
    animalId: '',
    vaccineName: '',
    vaccinationDate: '',
    note: '',
    status: '', // Trạng thái
    numberOfDoses: '' // Số mũi tiêm
  });

  const [animalName, setAnimalName] = useState(''); // Tên vật nuôi

  // Fetch danh sách vật nuôi từ API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('https://localhost:7185/api/TiemChung/LayAnimalTiem');
        setAnimals(response.data.animal); // API trả về object chứa mảng "animal"
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    fetchAnimals();
  }, []);

  // Xử lý thay đổi khi chọn vật nuôi
  const handleAnimalChange = (e) => {
    const selectedAnimalId = e.target.value;

    // Cập nhật ID và tìm tên vật nuôi từ danh sách đã load
    setVaccinationData((prev) => ({
      ...prev,
      animalId: selectedAnimalId,
    }));

    const selectedAnimal = animals.find((animal) => animal.id === selectedAnimalId);
    setAnimalName(selectedAnimal ? selectedAnimal.name : '');
  };

  // Xử lý thay đổi input chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVaccinationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setVaccinationData({
      animalId: '',
      vaccineName: '',
      vaccinationDate: '',
      note: '',
      status: '',
      numberOfDoses: ''
    });
  };

  // Xử lý gửi form tiêm chủng
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost:7185/api/TiemChung/nhapthongtintiem`, vaccinationData);
      if (response.status === 200) {
        alert('Vaccine created successfully!');
        setVaccinationData({
          animalId: '',
          vaccineName: '',
          vaccinationDate: '',
          note: '',
          status: '',
          numberOfDoses: ''
        });
        setAnimalName('');
      } else {
        alert('Failed to create vaccination.');
      }
    } catch (error) {
      console.error('Error creating vaccination:', error);
      alert('An error occurred while creating vaccination.');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2}}>
      <Typography variant="h4" mb={2} align="center">
        Nhập Thông Tin Tiêm Chủng
      </Typography>
      <IconButton color="primary" onClick={() => window.history.back()} sx={{ position: 'absolute', top: 80, right: 90 }}>
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Animal Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Vật nuôi</InputLabel>
              <Select
                name="animalId"
                value={vaccinationData.animalId}
                onChange={handleAnimalChange}
                label="Vật nuôi"
              >
                {animals.map((animal) => (
                  <MenuItem key={animal.id} value={animal.id}>
                    {animal.name} - {animal.type} {/* Hiển thị loại vật nuôi */}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Chọn vật nuôi cần tiêm</FormHelperText>
            </FormControl>
          </Grid>

          {/* Vaccine Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên Vaccine"
              name="vaccineName"
              value={vaccinationData.vaccineName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Vaccination Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày Tiêm"
              name="vaccinationDate"
              type="date"
              value={vaccinationData.vaccinationDate}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true, // Đảm bảo nhãn luôn thu nhỏ
              }}
              
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={vaccinationData.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="Đã Tiêm">Đã Tiêm</MenuItem>
                <MenuItem value="Chưa Tiêm">Chưa Tiêm</MenuItem>
                <MenuItem value="Tiêm Lại">Tiêm Lại</MenuItem>
                <MenuItem value="Tiêm Thất Bại">Tiêm Thất Bại</MenuItem>
              </Select>
              <FormHelperText>Chọn trạng thái tiêm</FormHelperText>
            </FormControl>
          </Grid>

          {/* Number of Doses */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số Lượng Mũi Tiêm"
              name="numberOfDoses"
              value={vaccinationData.numberOfDoses}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>

          {/* Note */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ghi Chú"
              name="note"
              value={vaccinationData.note}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={6}>
            <Button variant="contained" color="primary" type="submit" fullWidth onClick={handleSubmit}>
              Thêm Tiêm Chủng
            </Button>
          </Grid>

          {/* Reset Button */}
          <Grid item xs={6}>
            <Button variant="contained" color="secondary" onClick={resetForm} fullWidth>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default VaccinationForm;
