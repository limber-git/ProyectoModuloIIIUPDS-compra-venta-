import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const handleReset = async () => {
        try {
            await axios.post('https://localhost:7163/api/Auth/ResetPassword', { email });
            setMessage('Instructions to reset your password have been sent to your email.');
            setError('');
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('Failed to reset password. Please check your email and try again.');
            setMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleReset();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={2}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Reset Password
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {message && (
                    <Typography color="primary" variant="body2">
                        {message}
                    </Typography>
                )}
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Box mt={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{
                            backgroundColor: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                            color: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.contrastText,
                        }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ResetPassword;
