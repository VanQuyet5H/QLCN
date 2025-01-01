import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Notification from "../utils/Notification";

const CreateTreatmentForm = () => {
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [medications, setMedications] = useState([]); // Danh sách thuốc
  const [healthRecords, setHealthRecords] = useState([]); // Danh sách hồ sơ sức khỏe
  const [treatmentData, setTreatmentData] = useState({
    name: '',
    description: '',
    duration: '',
    medicines: [{ name: '', dosage: '', frequency: '', unit: '' }],
    healthRecordId: '',
    effectiveness: 'Tốt',
  });

  // Lấy danh sách thuốc và hồ sơ sức khỏe từ API
  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        const response = await axios.get(`https://localhost:7185/laydanhsachthuocvahealthrecord`);
        const data = await response.data;
        setMedications(data.medications);
        setHealthRecords(data.healthRecords);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu điều trị:', error);
      }
    };

    fetchTreatmentData();
  }, []);
  const checkMedicineQuantity = async (medicineName) => {
    try {
      const response = await axios.get(`https://localhost:7185/api/inventory/${medicineName}`);
      return response.data.quantity || 0; // Trả về số lượng hoặc 0 nếu không có dữ liệu
    } catch (error) {
      console.error(`Lỗi kiểm tra số lượng thuốc: ${medicineName}`, error);
      return 0; // Nếu có lỗi, trả về số lượng là 0
    }
  };
  
  const handleDosageChange = async (index, e) => {
    const { value } = e.target;
    const medicineName = treatmentData.medicines[index].name;
  
    if (!medicineName) {
      alert("Vui lòng chọn thuốc trước khi nhập liều lượng");
      return;
    }
  
    // Lấy số lượng thuốc từ kho
    const quantity = await checkMedicineQuantity(medicineName);
    
  
    // Kiểm tra xem liều lượng có vượt quá số lượng kho không
    if (parseInt(value) > quantity) {
      alert(`Liều lượng vượt quá số lượng thuốc trong kho. Còn lại: ${quantity}`);
      // Giữ nguyên liều lượng cũ nếu vượt quá số lượng
      const updatedMedicines = treatmentData.medicines.map((med, i) =>
        i === index ? { ...med, dosage: med.dosage } : med // Giữ nguyên liều lượng cũ
      );
      setTreatmentData((prev) => ({
        ...prev,
        medicines: updatedMedicines,
      }));
      return;
    }
  
    // Cập nhật liều lượng nếu không vượt quá số lượng
    const updatedMedicines = treatmentData.medicines.map((med, i) =>
      i === index ? { ...med, dosage: value } : med
    );
  
    setTreatmentData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };
  
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi cho các thuốc (danh sách thuốc)
  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicines = treatmentData.medicines.map((med, i) =>
      i === index ? { ...med, [name]: value } : med
    );
    setTreatmentData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  // Thêm một thuốc mới
  const addMedicine = () => {
    setTreatmentData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', unit: '' }],
    }));
  };

  // Xóa thuốc
  const removeMedicine = (index) => {
    const updatedMedicines = treatmentData.medicines.filter((_, i) => i !== index);
    setTreatmentData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  // Hủy bỏ và reset form
  const resetForm = () => {
    setTreatmentData({
      name: '',
      description: '',
      duration: '',
      medicines: [{ name: '', dosage: '', frequency: '', unit: '' }],
      healthRecordId: '',
      effectiveness: 'Tốt',
    });
  };

  // Gửi dữ liệu tạo Treatment mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    const treatmentPayload = {
      Name: treatmentData.name,
      Description: treatmentData.description,
      Duration: treatmentData.duration,
      Effectiveness: treatmentData.effectiveness,
      HealthRecordId: treatmentData.healthRecordId, // Gửi ID của Health Record
      Medicines: treatmentData.medicines.map(medicine => ({
        Name: medicine.name,
        Dosage: medicine.dosage,
        Frequency: medicine.frequency,
      }))
    };

    console.log('Thông tin gửi:', treatmentPayload);

    try {
      const response = await axios.post('https://localhost:7185/api/treatment', treatmentPayload);
      if (response.status === 200) {
        setNotification({ message: "Tạo điều trị thành công!", type: "success" });
      } else {
        setNotification({ message: "Tạo điều trị thất bại!", type: "error" });
      }
    } catch (error) {
      console.error('Lỗi khi tạo điều trị:', error);
      alert('Có lỗi xảy ra khi tạo điều trị.');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" mb={2}>
        Nhập thông tin điều trị
      </Typography>
      <IconButton color="primary" onClick={() => window.history.back()} sx={{ position: 'absolute', top: 60, right: 90 }}>
        <CloseIcon />
      </IconButton>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Tên điều trị */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên điều trị"
              name="name"
              value={treatmentData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Mô tả */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={treatmentData.description}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Thời gian */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Thời gian (ngày)"
              name="duration"
              type="number"
              value={treatmentData.duration}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Hiệu quả */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Hiệu quả</InputLabel>
              <Select
                label="Hiệu quả"
                name="effectiveness"
                value={treatmentData.effectiveness}
                onChange={handleChange}
              >
                <MenuItem value="Tốt">Tốt</MenuItem>
                <MenuItem value="Vừa">Vừa</MenuItem>
                <MenuItem value="Kém">Kém</MenuItem>
              </Select>
              <FormHelperText>Chọn mức độ hiệu quả</FormHelperText>
            </FormControl>
          </Grid>

          {/* Hồ sơ sức khỏe */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Hồ sơ sức khỏe</InputLabel>
              <Select
                name="healthRecordId"
                value={treatmentData.healthRecordId}
                onChange={handleChange}
                label="Hồ sơ sức khỏe"
              >
                {healthRecords.map((record) => (
                  <MenuItem key={record.id} value={record.id}>
                    {record.name} (ID: {record.id})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Chọn hồ sơ sức khỏe</FormHelperText>
            </FormControl>
          </Grid>

          {/* Thuốc */}
          {treatmentData.medicines.map((medicine, index) => (
            <Grid container spacing={2} key={index} sx={{ marginY: 1, marginLeft: 0 }}>
              <Grid item xs={3}>
                <FormControl fullWidth required>
                  <InputLabel>Tên thuốc</InputLabel>
                  <Select
                    name="name"
                    value={medicine.name || ""} // Đảm bảo value có giá trị hợp lệ
                    onChange={(e) => handleMedicineChange(index, e)}
                    label="Tên thuốc"
                  >
                    {medications.map((med) => (
                      <MenuItem key={med.name} value={med.name}>
                        {med.name} - {med.unit} {/* Hiển thị tên thuốc và đơn vị */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Liều lượng"
                  name="dosage"
                  value={medicine.dosage}
                  onChange={(e) => handleDosageChange(index, e)}
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Tần suất"
                  name="frequency"
                  value={medicine.frequency}
                  onChange={(e) => handleMedicineChange(index, e)}
                  required
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton color="error" onClick={() => removeMedicine(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Nút thêm thuốc */}
          <Grid item xs={12}>
            <Button variant="outlined" color="primary" onClick={addMedicine}>
              Thêm thuốc
            </Button>
          </Grid>

          {/* Nút gửi */}
          <Grid item xs={6}>
            <Button variant="contained" color="success" type="submit" fullWidth>
              Gửi
            </Button>
          </Grid>

          {/* Nút hủy */}
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" onClick={resetForm} fullWidth>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateTreatmentForm;
