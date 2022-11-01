import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/localStorageService';
import { storeUser } from '../../services/localStorageService';

const Registration = () => {
  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password2'),
      tc: data.get('tc'),
      role: data.get('role'),
      address: data.get('address'),
      contact: data.get('contact'),
      vAadhar: data.get('vAadhar'),
      healthLicense: data.get('healthLicense'),
      description: data.get('description'),
      location: data.get('location'),
      image1Path: data.get('image1Path'),
      image2Path: data.get('image2Path'),
      status: 'NA',
    }
    const res = await registerUser(actualData)
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
    <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='name' name='name' label='Name' />
      {server_error.name ? <Typography>{server_error.name[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? <Typography>{server_error.email[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='role' name='role' label='role' />
      <TextField margin='normal' required fullWidth id='address' name='address' label='address' />
      <TextField margin='normal' required fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' />
      <TextField margin='normal' required fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      <TextField margin='normal' required fullWidth id='description' name='description' label='description' />
      <TextField margin='normal' required fullWidth id='location' name='location' label='location' />
      <TextField margin='normal' required fullWidth id='image1Path' name='image1Path' label='image1Path' />
      <TextField margin='normal' required fullWidth id='image2Path' name='image2Path' label='image2Path' />

      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password ? <Typography>{server_error.password[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='password2' name='password2' label='Confirm Password' type='password' />
      {server_error.password2 ? <Typography>{server_error.password2[0]}</Typography> : ""}
      <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to term and condition." />
      {server_error.tc ? <Typography>{server_error.tc[0]}</Typography> : ""}
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
      </Box>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
    </Box>
  </>;
};

export default Registration;
