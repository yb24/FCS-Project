import { removeToken, removeUser, getToken, getUser } from "../services/localStorageService";
import { useProfileUserMutation, useChangeUserPasswordMutation } from "../services/userAuthApi";
import { TextField, FormControlLabel, Checkbox, Box, Alert, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Profile = () => {
    console.log("process :",`${process.env.REACT_APP_BACKEND}`)
    const [profileUser, {isLoading}] = useProfileUserMutation()
    const [changeUserPassword] = useChangeUserPasswordMutation()
    const [visibleItem, setVisibleItem] = useState('')
    const [server_error, setServerError] = useState({})
    const [userInfo, setUserInfo] = useState({})
    let {username, useremail} = getUser()
    let {access_token, refresh_token} = getToken()
    let userID = ""
    if (access_token != null) {
        userID = JSON.parse(window.atob(access_token.split('.')[1]))
        userID = userID['user_id'] 
        console.log("userid", userID)
    }

    const navigate = useNavigate()

    const handleLogout = () => {
        console.log("Logout Clicked");
        //remove tokens
        removeToken()
        removeUser()
        navigate('/login')
    }

    const handleProfile = async () => {
        console.log("Profile Clicked");
        //2. use decoded userid
        const actualData = {
          id: userID,
        }
        const res = await profileUser(actualData)
        if (res.error)
        {
          console.log(res.error.data.errors) //from renderers.js file backend
        }
        if (res.data)
        {
          console.log(res.data)
          //3. show json on page
          setVisibleItem('')
          document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"

        }
    }

    const handleProfileEdit = async () => {
        console.log("profile edit Clicked")
        //1. remove view profile info in div
        document.getElementById("add_profile").innerHTML = "<p></p>"
        //2. set user info
        const actualData = {
          id: userID,
        }
        const res = await profileUser(actualData)
        if (res.error)
        {
          console.log(res.error.data.errors) //from renderers.js file backend
        }
        if (res.data)
        {
          console.log(res.data)
          //3. set user info
          setUserInfo(res.data)
        }
        //3. render text fields in box
        setVisibleItem('yes')
       
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const actualData = {
        name: data.get('name'),
        email: userInfo['email'],
        password: data.get('password'),
        address: data.get('address'),
        contact: data.get('contact'),
        vAadhar: data.get('vAadhar'),
        healthLicense: data.get('healthLicense'),
        description: data.get('description'),
        location: data.get('location'),
        image1Path: data.get('image1Path'),
        image2Path: data.get('image2Path'),
      }
      console.log(actualData)
      const res = await changeUserPassword({actualData})

      if (res.error)
      {
        console.log(res.error.data.errors) //from renderers.js file backend
        setServerError(res.error.data.errors)
      }
      if (res.data)
      {
        console.log("new data : ",res.data)
      }
      //3. remove text fields in box
      setVisibleItem('')
    }

      return <>
      <Grid container justifyContent='center'>
        <Grid item sm={10}>
          <h1>Dashboard</h1>
          <hr />
          <p>Hello {useremail}</p> 
          <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
          <Button variant='contained' color='warning' size='large' onClick={handleProfile} sx={{ mt: 8 }}>View Profile</Button>
          <Button variant='contained' color='warning' size='large' onClick={handleProfileEdit} sx={{ mt: 8 }}>Edit Profile</Button>
          <div id="add_profile"></div>
          {visibleItem=='yes' && 
          <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required fullWidth id='name' name='name' label='Name' defaultValue ={userInfo['name']}/>
          {server_error.name ? <Typography>{server_error.name[0]}</Typography> : ""}
          <TextField margin='normal' required fullWidth id='address' name='address' label='address' defaultValue={userInfo['address']} />
          <TextField margin='normal' required fullWidth id='contact' name='contact' label='contact' defaultValue={userInfo['contact']} />
          <TextField margin='normal' required fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' defaultValue={userInfo['vAadhar']}/>
          <TextField margin='normal' required fullWidth id='healthLicense' name='healthLicense' label='healthLicense' defaultValue={userInfo['healthLicense']}/>
          <TextField margin='normal' required fullWidth id='description' name='description' label='description' defaultValue={userInfo['description']}/>
          <TextField margin='normal' required fullWidth id='location' name='location' label='location' defaultValue={userInfo['location']}/>
          <TextField margin='normal' required fullWidth id='image1Path' name='image1Path' label='image1Path' defaultValue={userInfo['image1Path']}/>
          <TextField margin='normal' required fullWidth id='image2Path' name='image2Path' label='image2Path' defaultValue={userInfo['image2Path']}/>
    
          <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
          {server_error.password ? <Typography>{server_error.password[0]}</Typography> : ""}
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
          </Box>
          {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
        </Box>}
        </Grid>
      </Grid>
    </>;

};

export default Profile;