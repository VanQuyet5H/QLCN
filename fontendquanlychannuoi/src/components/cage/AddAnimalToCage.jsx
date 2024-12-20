import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const AddAnimalToCage = ({ cageId }) => {
    const [animal, setAnimal] = useState({
        name: '',
        species: '',
        age: '',
        healthStatus: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnimal((prevAnimal) => ({
            ...prevAnimal,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/cage/${cageId}/AddAnimal`, animal)
            .then(response => {
                alert('Animal added to cage!');
            })
            .catch(error => {
                console.error('Error adding animal to cage:', error);
            });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={animal.name}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                label="Species"
                variant="outlined"
                fullWidth
                name="species"
                value={animal.species}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                label="Age"
                variant="outlined"
                fullWidth
                name="age"
                type="number"
                value={animal.age}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                label="Health Status"
                variant="outlined"
                fullWidth
                name="healthStatus"
                value={animal.healthStatus}
                onChange={handleChange}
                margin="normal"
            />
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Add Animal
            </Button>
        </Box>
    );
};

export default AddAnimalToCage;
