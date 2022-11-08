import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUser } from '../services/localStorageService';
import ChangePassword from './auth/ChangePassword';

const Dashboard = () => {
  
  return <>
    <CssBaseline />
    <h1>dashboard</h1>
  </>;
};

export default Dashboard;
