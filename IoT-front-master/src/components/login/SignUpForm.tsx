import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import serverConfig from '../../server-config';

interface Account {
    username: string;
    name: string;
    email: string;
    password: string;
}

interface Errors {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
}

const SignUpForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({
        username: '',
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Errors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};

        if (account.username.trim() === '') {
            validationErrors.username = 'Username is required!';
        }
        if (account.name.trim() === '') {
            validationErrors.name = 'Name is required!';
        }
        if (account.email.trim() === '') {
            validationErrors.email = 'Email is required!';
        }
        if (account.password.trim() === '') {
            validationErrors.password = 'Password is required!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        axios
            .post(`${serverConfig.serverUrl}user/create`, {
                username: account.username,
                name: account.name,
                email: account.email,
                password: account.password
            })
            .then((response) => {
                if (response.status === 200) {
                    setSuccessMessage('Account created successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login', { state: { accountCreated: true } });
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error('Error creating account:', error);
            });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={account.username}
                        name="username"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Name"
                        value={account.name}
                        name="name"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Email"
                        value={account.email}
                        name="email"
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
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
                    Sign Up
                </Button>
                {Object.values(errors).some((error) => error) && (
                    <Box mt={2}>
                        {Object.values(errors).map((error, index) => (
                            error && (
                                <Alert severity="error" key={index}>
                                    {error}
                                </Alert>
                            )
                        ))}
                    </Box>
                )}
                {successMessage && (
                    <Box mt={2}>
                        <Alert severity="success">{successMessage}</Alert>
                    </Box>
                )}
            </form>
        </Container>
    );
};

export default SignUpForm;
