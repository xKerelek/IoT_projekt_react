import './DeviceState.css';
import {useState, useEffect} from "react";
import serverConfig from "../server-config";
import DevicesState from "./DevicesState";
import {sortElemsByDeviceId} from "../utils/helper";
import Loader from "./shared/Loader";
import {EntryModel} from "../models/entry.model";
import { isExpired } from 'react-jwt';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState<EntryModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [isUserLogged, setUserLogged] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setUserLogged(!!token && !isExpired(token));
    }, []);

    const fetchData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`) 
            .then(response => response.json())
            .then(data => {
                setData(sortElemsByDeviceId(data));
                setLoaderState(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    
    return (
        <>
            <div style={{backgroundColor: '#000', display: 'flex', justifyContent: 'center'}}>
                {loaderState &&
                    <div style={{marginTop: '50vh'}}>
                        <Loader/>
                    </div>
                }
                {!loaderState && isUserLogged && data && <DevicesState data={data}/>}
                {!loaderState && !isUserLogged && (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100vh' 
                }}>
                    <h1 style={{ 
                        color: 'blue', 
                        fontSize: 48, 
                        fontFamily: 'fantasy',
                    }}>
                        You must be logged in to see the content!
                    </h1>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body1" color="white">
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
                </div>
                )}
            </div>
        </>
    )
}

export default Home;
