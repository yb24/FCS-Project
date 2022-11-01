import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { storeToken, storeUser } from '../../services/localStorageService';
import { useLoginUserMutation } from '../../services/userAuthApi'

const UserLogin = () => {
  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [loginUser, {isLoading}] = useLoginUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error)
    {
      console.log(res.error.data.errors) //from renderers.js file backend
      setServerError(res.error.data.errors)
    }
    if (res.data)
    {
      console.log(res.data)
      //save token
      storeToken(res.data.token)
      storeUser(actualData)
      navigate('/')
    }
  }
  return <>
    <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? <Typography>{server_error.email[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password ? <Typography>{server_error.password[0]}</Typography> : ""}
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button>
      </Box>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
    </Box>
  </>;
};

export default UserLogin;
