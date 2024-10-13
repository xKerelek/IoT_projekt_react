import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';

function AddData() {
    const [deviceId, setDeviceId] = useState('');
    const [temperature, setTemperature] = useState('');
    const [pressure, setPressure] = useState('');
    const [humidity, setHumidity] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSnackbarMessage('');

        const data = {
            air: [
                { id: 1, value: parseFloat(temperature) },
                { id: 2, value: parseFloat(pressure) },
                { id: 3, value: parseFloat(humidity) }
            ]
        };

        try {
            const response = await axios.post(`http://localhost:3100/api/data/${deviceId}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbarMessage(`Data added successfully: ${JSON.stringify(response.data)}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Error adding data');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add Data to Device
                </Typography>
                <TextField
                    label="Device ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    required
                    helperText="Enter the unique ID of the device."
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Temperature (°C)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                    helperText="Enter the temperature reading in degrees Celsius."
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Pressure (hPa)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value)}
                    required
                    helperText="Enter the pressure reading in hectopascals."
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Humidity (%)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                    helperText="Enter the humidity reading as a percentage."
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                >
                    Submit
                </Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AddData;
