import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import Notification from '../utils/Notification';
const FeedForm = () => {
    const [animalId, setAnimalId] = useState('');
    const [foodType, setFoodType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const [notes, setNotes] = useState('');
    const [calories, setCalories] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fat, setFat] = useState('');
    const [minerals, setMinerals] = useState('');
    const [protein, setProtein] = useState('');
    const [vitamins, setVitamins] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    // State to store fetched data
    const [animals, setAnimals] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // Lấy userId từ localStorage khi component load
        const storedUserId = localStorage.getItem('id');
        console.log('id', storedUserId);
        if (storedUserId) {
            setUserId(storedUserId); // Cập nhật state với giá trị userId
        } else {
            console.log('Không tìm thấy userId trong localStorage');
        }
    }, []);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Giả sử bạn có API để lấy danh sách mã vật nuôi và người dùng
                const animalResponse = await axios.get('https://localhost:7185/api/DinhDuong/animals');
                const animalData = await animalResponse.data;
                setAnimals(animalData);
            } catch (error) {
                console.error('Có lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);
    const handleCancel = () => {
        setAnimalId('');
        setFoodType('');
        setQuantity('');
        setCost('');
        setNotes('');
        setCalories('');
        setCarbohydrates('');
        setFat('');
        setMinerals('');
        setProtein('');
        setVitamins('');
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const feedData = {
            animalId,
            userId,
            foodType,
            quantity,
            cost,
            notes,
            calories,
            carbohydrates,
            fat,
            minerals,
            protein,
            vitamins
        };

        try {
            const response = await fetch('https://localhost:7185/api/DinhDuong/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedData),
            });

            if (response.ok) {
                setNotification({ message: 'Thêm chế độ ăn thành công', type: 'success' });
            } else {
                alert('Có lỗi xảy ra khi tạo chế độ ăn.');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi yêu cầu.');
        }
    };

    return (
        <Box sx={{ maxWidth: 900, margin: '0 auto', padding: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Tạo Chế Độ Ăn Cho Vật Nuôi
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Cột 1 */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mã Vật Nuôi"
                            select
                            fullWidth
                            value={animalId}
                            onChange={(e) => setAnimalId(e.target.value)}
                            required
                        >
                            <MenuItem value="">Chọn Mã Vật Nuôi</MenuItem>
                            {animals.map((animal) => (
                                <MenuItem key={animal.id} value={animal.id}>
                                    {animal.name} (ID: {animal.id})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mã Người Dùng"
                            select
                            fullWidth
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        >
                            {/* Nếu bạn muốn hiển thị thông tin cho người dùng, thêm vào MenuItem */}
                            <MenuItem value={userId}>{userId}</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Loại Thức Ăn"
                            fullWidth
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Số Lượng"
                            type="number"
                            fullWidth
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Chi Phí"
                            type="number"
                            fullWidth
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            required
                        />
                    </Grid>

                    {/* Cột 2 */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Lượng Calo"
                            type="number"
                            fullWidth
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Carbohydrate"
                            type="number"
                            fullWidth
                            value={carbohydrates}
                            onChange={(e) => setCarbohydrates(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Chất Béo"
                            type="number"
                            fullWidth
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Khoáng Chất"
                            type="number"
                            fullWidth
                            value={minerals}
                            onChange={(e) => setMinerals(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Chất Đạm"
                            type="number"
                            fullWidth
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Vitamin"
                            type="number"
                            fullWidth
                            value={vitamins}
                            onChange={(e) => setVitamins(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ghi Chú"
                            fullWidth
                            multiline
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Tạo Chế Độ Ăn
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={handleCancel}  // Gọi hàm reset khi nhấn nút hủy
                        >
                            Hủy
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default FeedForm;
