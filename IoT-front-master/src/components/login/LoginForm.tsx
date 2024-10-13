import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import serverConfig from '../../server-config';

interface Account {
    login: string;
    password: string;
}

interface Errors {
    login?: string;
    password?: string;
}

const LoginForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({ login: '', password: '' });
    const [errors, setErrors] = useState<Errors>({});
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};

        if (account.login.trim() === '') {
            validationErrors.login = 'Login is required!';
        }
        if (account.password.trim() === '') {
            validationErrors.password = 'Password is required!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError(null);
    
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;
    
        axios.post(`${serverConfig.serverUrl}user/auth`, {
            login: account.login,
            password: account.password
        })
        .then(response => {
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setLoginSuccess(true);
                setTimeout(() => {
                    window.location.replace("/");
                }, 2000);
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                setLoginError('Invalid login or password');
            } else {
                setLoginError('An unexpected error occurred');
            }
            console.error('Error logging in!', error);
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount(prevAccount => ({
            ...prevAccount,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            {location.state?.accountCreated && (
                <Box mb={2}>
                    <Alert severity="success">Account created successfully! Please log in.</Alert>
                </Box>
            )}
            <form onSubmit={handleSubmit}>
                {loginSuccess && (
                    <Box mb={2}>
                        <Alert severity="success">Login successful! Redirecting...</Alert>
                    </Box>
                )}
                <Box mb={2}>
                    <TextField
                        label="Login"
                        value={account.login}
                        name="login"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.login)}
                        helperText={errors.login}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        value={account.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                {loginError && (
                    <Box mt={2}>
                        <Alert severity="error">
                            {loginError}
                        </Alert>
                    </Box>
                )}
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body1">
                    Don't have an account?{' '}
                    <Button
                        component={Link}
                        to="/register"
                        sx={{ color: '#4caf50' }}
                    >
                        Create one here
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
};

export default LoginForm;
