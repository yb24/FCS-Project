import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { storeToken, storeUser, getToken } from '../../services/localStorageService';
import { useLoginUserMutation, useProfileUserMutation } from '../../services/userAuthApi'

const UserLogin = () => {
  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [loginUser, {isLoading}] = useLoginUserMutation()
  const [profileUser, {isLoading1}] = useProfileUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    ////console.log("heyo")
    ////console.log(`${process.env.REACT_APP_BACKEND}`)
    const res = await loginUser(actualData)
    if (res.error)
    {
      ////console.log(res.error.data.errors) //from renderers.js file backend
      setServerError(res.error.data.errors)
    }
    if (res.data)
    {
      ////console.log(res.data)
      //save token
      storeToken(res.data.token)
      //storeUser(actualData)
      //get role from token
      //1. get userid from access_token
      let {access_token} = getToken()
      ////console.log("access token is :: ",access_token)
      let userID = ""
      if (access_token != null) {
        userID = JSON.parse(window.atob(access_token.split('.')[1]))
        userID = userID['user_id'] 
        ////console.log("userid is : ", userID)
      }
      ////console.log("Got userid : ", userID)
      //2. get user role from id
      const actualData_temp = {
        id: userID,
      }
      const res_temp = await profileUser(actualData_temp)
      if (res_temp.error)
      {
        ////console.log(res_temp.error.data.errors) //from renderers.js file backend
      }
      if (res_temp.data)
      {
        ////console.log(res_temp.data)
      }
      ////console.log("Got userrole : ", res_temp.data)
      //3. redirect based on user role and status
      navigate('../')
      /*if (res_temp.data['status']=='NA' || res_temp.data['status']=='RM')
      {
        navigate('../');
      }
      else if (res_temp.data['role']=='PT')
      {
        navigate('../PatientView/')
      }
      else if (res_temp.data['role']=='HP')
      {
        navigate('../HealthcareProfessioanlView/')
      }
      else if (res_temp.data['role']=='HS')
      {
        navigate('../HospitalView/')
      }
      else if (res_temp.data['role']=='PH')
      {
        navigate('../PharmacyView/')
      }
      else if (res_temp.data['role']=='IF')
      {
        navigate('../InsuranceFirmView/')
      }
      else
      {
        navigate('../')
      }*/
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
