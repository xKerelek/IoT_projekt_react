import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { EntryModel } from '../../models/entry.model';

interface TileProps {
    data: EntryModel | null;
    id?: string | number;
    hasData?: boolean;
    details?: boolean;
    active?: boolean;
    isMeasurementDifferent?: boolean;
}
;

function Tile({ id, hasData, data, active = false, details = true, isMeasurementDifferent = false }: TileProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    const handleDeleteData = async (timeRange: string) => {
        handleCloseMenu();

        if (!id) {
            setSnackbarMessage("Please select a device.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            let startDate = new Date();
            if (timeRange === '10min') {
                startDate.setMinutes(startDate.getMinutes() - 10);
            } else if (timeRange === '30min') {
                startDate.setMinutes(startDate.getMinutes() - 30);
            } else if (timeRange === '60min') {
                startDate.setMinutes(startDate.getMinutes() - 60);
            } else if (timeRange === 'all') {
                startDate = new Date(0);
            }

            const endDate = new Date();
            console.log(`Deleting data for device ${id} from ${startDate} to ${endDate}`);

            await axios.delete(`http://localhost:3100/api/data/${id}/time`, {
                params: { start: startDate.toISOString(), end: endDate.toISOString() },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                }
            });

            setSnackbarMessage('Data deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error deleting data:', error);
            setSnackbarMessage('Error deleting data');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Card className={`tile-device-inside ${active ? 'active' : ''} ${hasData && isMeasurementDifferent ? 'tile-content-alert' : ''}`} sx={{ minWidth: 275 }}>
            <CardContent style={{ minHeight: '200px' }}>
                <Typography style={{ borderBottom: '5px solid #fff', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }} variant="h5" component="div">
                    Device No. {id}
                    {hasData && isMeasurementDifferent && <Tooltip title={"Difference between two last readings is 20% or more"}>
                        <WarningIcon />
                    </Tooltip>}
                </Typography>
                {!hasData && (
                    <Typography variant="h6" component="div">
                        No data
                    </Typography>
                )}
                {hasData && (
                    <Typography style={{ paddingTop: '10px' }} component="div">
                        <Typography variant="h6" component="div">
                            <DeviceThermostatIcon />
                            <span className="value">{data?.temperature}</span> <span>&deg;C</span>
                        </Typography>
                        <Typography variant="h6" component="div">
                            <CloudUploadIcon />
                            <span className="value">{data?.pressure}</span> hPa
                        </Typography>
                        <Typography variant="h6" component="div">
                            <OpacityIcon />
                            <span className="value">{data?.humidity}</span>%
                        </Typography>
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                {details && (
                    <Button size="small" component={Link} to={`/device/${id}`}>Details</Button>
                )}
                {hasData && (
                    <div>
                        <Button
                            size="small"
                            onClick={handleClick}
                            style={{ backgroundColor: 'red', color: 'white' }}
                        >
                            DELETE
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            <MenuItem onClick={() => handleDeleteData('10min')}>Last 10 Minutes</MenuItem>
                            <MenuItem onClick={() => handleDeleteData('30min')}>Last 30 Minutes</MenuItem>
                            <MenuItem onClick={() => handleDeleteData('60min')}>Last 60 Minutes</MenuItem>
                            <MenuItem onClick={() => handleDeleteData('all')}>All Data</MenuItem>
                        </Menu>
                    </div>
                )}
            </CardActions>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Card>
    );
}

export default Tile;
