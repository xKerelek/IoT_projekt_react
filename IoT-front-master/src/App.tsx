import './App.css'
import Navbar from "./components/shared/Navbar";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./components/Dashboard";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./components/Home";
import { isExpired } from "react-jwt";
import SignUpForm from './components/login/SignUpForm';
import LoginForm from './components/login/LoginForm';
import {PrivateRoute} from './components/login/PrivateRoute';
import Footer from './components/shared/Footer';
import AddData from './components/AddData';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    return (
        <Router>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/device/:id" element={<PrivateRoute path='/device/:id' element={<Dashboard />} /> } />
                    <Route path="path" element={isExpired(localStorage.getItem('token')) ? <Navigate replace to="/"/> : <Dashboard
                        />}/>
                    <Route path='/register' element={<SignUpForm />} />
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/add-data' element={<AddData />} />
                </Routes>
                <Footer></Footer>
            </ThemeProvider>
        </Router>
    )
}

export default App;
