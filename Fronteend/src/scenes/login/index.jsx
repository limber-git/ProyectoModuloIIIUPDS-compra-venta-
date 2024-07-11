import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:7163/api/Auth/Login', {
                login: username,
                clave: password,
            });
            const { token } = response.data;
            Cookies.set('token', token);
            onLogin(token);
            navigate('/'); // Redirige al dashboard después de iniciar sesión
        } catch (error) {
            console.error('Error during login:', error);
            setError('Failed to login. Please check your username and password.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    const handleForgotPassword = () => {
        // Aquí puedes redirigir al usuario a la página de recuperación de contraseña
        console.log('Redirigir a la página de recuperación de contraseña');
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
                Login
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Box mt={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Login
                    </Button>
                </Box>
                <Box mt={2} textAlign="center">
                    <Link
                        onClick={handleForgotPassword}
                        style={{ cursor: 'pointer', color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
                        variant="body2"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </Box>
            </form>
        </Box>
    );
};

export default Login;
