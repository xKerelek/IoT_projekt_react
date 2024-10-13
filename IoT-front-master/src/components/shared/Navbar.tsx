import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { Link, useNavigate } from 'react-router-dom';
import { isExpired } from "react-jwt";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const pages = [
    { name: 'Devices state', path: '/' },
    { name: 'Add data', path: '/add-data'}
];


function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
    const navigate = useNavigate();
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isExpired(token)) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
        window.location.reload();
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleDeleteAllData = async () => {
        try {
            await axios.delete('http://localhost:3100/api/data/all', {
                headers: {
                    'x-auth-token': localStorage.getItem('token') || ''
                }
            });
            setSnackbarMessage('All data deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setSnackbarMessage('Error deleting all data');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <AppBar position="static">
            <Container maxWidth={false} sx={{ backgroundColor: 'black' }}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <LanguageIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        IoT Dashboard
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem key="deleteAllData" onClick={() => { handleCloseNavMenu(); handleDeleteAllData(); }}>
                                <Typography textAlign="center">Delete All Data</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={Link}
                                to={page.path}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                        <Button
                            key="deleteAllData"
                            onClick={handleDeleteAllData}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Delete All Data
                        </Button>
                    </Box>

                    {isAuthenticated ? (
                        <>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="" src="" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key={"Logout"} onClick={handleCloseNavMenu}>
                                        <Typography textAlign={"center"}>
                                            <Link onClick={handleLogout} style={{ color: 'white'}}>Logout</Link>
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/login" color="inherit">
                                Login
                            </Button>
                            <Button component={Link} to="/register" color="inherit">
                                Sign up
                            </Button>
                        </>
                    )}
                    <div className="logo"></div>
                </Toolbar>
            </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </AppBar>
    );
}

export default Navbar;
