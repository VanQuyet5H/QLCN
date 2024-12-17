import React, { useState } from "react";
import { TextField, Button, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Grid } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const DietCalculator = () => {
  const [foodItems, setFoodItems] = useState([
    { foodItem: "", quantity: 0, protein: 0, fat: 0, carbohydrates: 0, vitamins: 0, minerals: 0 },
  ]);
  const [result, setResult] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newFoodItems = [...foodItems];
  
    // Kiểm tra nếu trường là "foodItem", giữ nguyên giá trị chữ
    if (field === "foodItem") {
      newFoodItems[index][field] = value; // Giữ nguyên giá trị chuỗi
    } else {
      // Kiểm tra và chuyển đổi các trường số hợp lệ
      const parsedValue = isNaN(value) || value === "" ? 0 : parseFloat(value);
      newFoodItems[index][field] = parsedValue; // Cập nhật giá trị cho trường tương ứng
    }
  
    setFoodItems(newFoodItems);
  };

  const handleAddRow = () => {
    setFoodItems([
      ...foodItems,
      { foodItem: "", quantity: 0, protein: 0, fat: 0, carbohydrates: 0, vitamins: 0, minerals: 0 },
    ]);
    setResult(null); // Reset kết quả khi thêm hàng mới
  };

  const handleDeleteRow = (index) => {
    const newFoodItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(newFoodItems);
    setResult(null); // Reset kết quả khi xóa hàng
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`https://localhost:7185/api/DinhDuong/calculate`, foodItems);
      setResult(response.data);
    } catch (error) {
      console.error("Error calculating nutrition:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tính Toán Hàm Lượng Dinh Dưỡng
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thức Ăn</TableCell>
              <TableCell>Số Lượng (kg)</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Chất Béo</TableCell>
              <TableCell>Tinh Bột</TableCell>
              <TableCell>Vitamin</TableCell>
              <TableCell>Khoáng Chất</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={item.foodItem}
                    onChange={(e) => handleInputChange(index, "foodItem", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.protein}
                    onChange={(e) => handleInputChange(index, "protein", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.fat}
                    onChange={(e) => handleInputChange(index, "fat", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.carbohydrates}
                    onChange={(e) => handleInputChange(index, "carbohydrates", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.vitamins}
                    onChange={(e) => handleInputChange(index, "vitamins", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.minerals}
                    onChange={(e) => handleInputChange(index, "minerals", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Button onClick={handleAddRow} variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
        Thêm Hàng
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="secondary" sx={{ mt: 2 }}>
        Tính Toán
      </Button>

      {result && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Kết Quả
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Protein Tổng: {result.totalProtein} g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Chất Béo Tổng: {result.totalFat} g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Tinh Bột Tổng: {result.totalCarbohydrates} g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Vitamin Tổng: {result.totalVitamins} mg</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Khoáng Chất Tổng: {result.totalMinerals} mg</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Năng Lượng Tổng: {result.totalCalories} kcal</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Phần giải thích công thức */}
      <Box mt={4}>
        <Typography variant="h6">Giải Thích Công Thức Tính Toán</Typography>
        <Typography>
          <strong>Công thức tính năng lượng tổng:</strong> <br />
          Năng Lượng Tổng = (Protein * 4) + (Fat * 9) + (Carbohydrates * 4) <br />
          <strong>Công thức tính các yếu tố dinh dưỡng:</strong> <br />
          Protein, Chất Béo, Tinh Bột, Vitamin và Khoáng Chất được tính dựa trên số lượng (kg) của mỗi thức ăn và giá trị dinh dưỡng trên mỗi kg của thức ăn đó.
        </Typography>
      </Box>
    </Box>
  );
};

export default DietCalculator;
