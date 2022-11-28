import { removeToken, removeUser, getToken, getUser } from "../services/localStorageService";
import { useProfileUserMutation, useChangeUserPasswordMutation } from "../services/userAuthApi";
import { TextField, FormControlLabel, Checkbox, Box, Alert, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    ////console.log("process :",`${process.env.REACT_APP_BACKEND}`)
    const [profileUser, {isLoading}] = useProfileUserMutation()
    const [changeUserPassword] = useChangeUserPasswordMutation()
    const [visibleItem, setVisibleItem] = useState('')
    //const [server_error, setServerError] = useState({})
    const [userInfo, setUserInfo] = useState({})
    const [error, setError] = useState({status: false, msg: "", type: ""})
    //let {username, useremail} = getUser()
    let {access_token} = getToken()
    let userID = ""
    var regName = /\d+$/g; 
    var regPhone=/^\d{10}$/;
    var regVAadhar=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regVAadhar1=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regVAadhar2=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if (access_token != null) {
      try 
      {
        userID = JSON.parse(window.atob(access_token.split('.')[1]))
        userID = userID['user_id'] 
        ////console.log("userid", userID)
      }
      catch (err)
    {
      ////console.log("GOT ERROR")
    }
    }

    const navigate = useNavigate()
    const [useremail, setUserEmail] = useState('')
    //role based access control
    var role = ''
    useEffect(() => {
      ////console.log("URL",window.location.href)
      if(!access_token)
      {
        navigate("../../")
        return;
      }
        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/get_role`,
          data:{
              token: access_token,
          }
        }).then((response)=>{
            ////console.log("role is",response.data.role)
            role = response.data.role
            setUserEmail(response.data.email)
            if (response.data.userStatus!="AU")
            {
                navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/HealthcareProfessioanlView/Profile'.toLowerCase() && !(role=="HP" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/HospitalView/Profile'.toLowerCase() && !(role=="HS" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PatientView/Profile'.toLowerCase() && !(role=="PT" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PharmacyView/Profile'.toLowerCase() && !(role=="PH" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/InsuranceFirmView/Profile'.toLowerCase() && !(role=="IF" || role=="AD"))
            {
              navigate("../../")
            }
        }).catch((error) => {
            navigate("../../")
        })
    }, []); 

    const handleLogout = () => {
        ////console.log("Logout Clicked");
        //remove tokens
        removeToken()
        removeUser()
        navigate('/login')
    }

    const handleProfile = async () => {
        ////console.log("Profile Clicked");
        //2. use decoded userid
        const actualData = {
          id: userID,
        }
        const res = await profileUser(actualData)
        if (res.error)
        {
          ////console.log(res.error.data.errors) //from renderers.js file backend
        }
        if (res.data)
        {
          ////console.log(res.data)
          //3. show json on page based on role
          setVisibleItem('')
          if (res.data.role=='PT')
          {
            document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> contact:"+res.data['contact']+"<br> vAadhar:"+res.data['vAadhar']+"</p>"
          }
          else if (res.data.role=='HS' || res.data.role=='PH' || res.data.role=='IF')
          {
            document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"
          }
          else if(res.data.role=='HP')
          {
            document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> contact:"+res.data['contact']+"<br> healthLicense:"+res.data['healthLicense']+"<br> vAadhar:"+res.data['vAadhar']+"</p>"
          }
          else if (res.data.role=='AD')
          {
            document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"
          }
          //document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"
        }
    }

    const handleProfileEdit = async () => {
        ////console.log("profile edit Clicked")
        //1. remove view profile info in div
        document.getElementById("add_profile").innerHTML = "<p></p>"
        //2. set user info
        const actualData = {
          id: userID,
        }
        const res = await profileUser(actualData)
        if (res.error)
        {
          ////console.log(res.error.data.errors) //from renderers.js file backend
        }
        if (res.data)
        {
          ////console.log("resdata",res.data)
          //3. set user info
          setUserInfo(res.data)
        }
        //3. render text fields in box
        setVisibleItem(res.data.role+'')
        setError({})
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      var actualData = {}
      if (visibleItem=='PT')
      {
          actualData = {
          name: data.get('name'),
          email: userInfo['email'],
          password: data.get('password'),
          address: "NA",
          contact: data.get('contact'),
          vAadhar: data.get('vAadhar'),
          healthLicense: "NA",
          description: "NA",
          location: "NA",
          image1Path: "www.google.com",
          image2Path: "www.google.com",
        }
        //client side form validation
        //1. valid name - regex check
        if (regName.test(actualData.name))
        {
          setError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
          return
        }
        //4. valid contact - regex check
        else if (!regPhone.test(actualData.contact))
        {
          setError({ status: true, msg: "contact field is incorrectly filled", type: 'error' })
          return
        }
        //5. valid vaadhar - regex check
        else if (!regVAadhar.test(actualData.vAadhar))
        {
          setError({ status: true, msg: "virtual aadhar field is incorrectly filled", type: 'error' })
          return
        }

      }
      else if (visibleItem=='HS' || visibleItem=='PH' || visibleItem=='IF')
      {
          actualData = {
          name: data.get('name'),
          email: userInfo['email'],
          password: data.get('password'),
          address: data.get('address'),
          contact: data.get('contact'),
          vAadhar: "NA",
          healthLicense: data.get('healthLicense'),
          description: data.get('description'),
          location: data.get('location'),
          image1Path: data.get('image1Path'),
          image2Path: data.get('image2Path'),
        }
        //client side form validation
        //1. valid name - regex check
        if (regName.test(actualData.name))
        {
          setError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
          return
        }
        //4. valid contact - regex check
        else if (!regPhone.test(actualData.contact))
        {
          setError({ status: true, msg: "contact field is incorrectly filled", type: 'error' })
          return
        }
        else if (!regVAadhar1.test(actualData.image1Path))
        {
          setError({ status: true, msg: "image 1 path field is incorrectly filled", type: 'error' })
          return
        }
        else if (!regVAadhar2.test(actualData.image2Path))
        {
          setError({ status: true, msg: "image 2 path field is incorrectly filled", type: 'error' })
          return
        }
      }
      else if (visibleItem=='HP')
      {
          actualData = {
          name: data.get('name'),
          email: userInfo['email'],
          password: data.get('password'),
          address: "NA",
          contact: data.get('contact'),
          vAadhar: data.get('vAadhar'),
          healthLicense: data.get('healthLicense'),
          description: "NA",
          location: "NA",
          image1Path: "www.google.com",
          image2Path: "www.google.com",
        }
        //client side form validation
        //1. valid name - regex check
        if (regName.test(actualData.name))
        {
          setError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
          return
        }
        //4. valid contact - regex check
        else if (!regPhone.test(actualData.contact))
        {
          setError({ status: true, msg: "contact field is incorrectly filled", type: 'error' })
          return
        }
        //5. valid vaadhar - regex check
        else if (!regVAadhar.test(actualData.vAadhar))
        {
          setError({ status: true, msg: "virtual aadhar field is incorrectly filled", type: 'error' })
          return
        }
      }
      else if (visibleItem=='AD')
      {
          actualData = {
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
        //client side form validation
        //1. valid name - regex check
        if (regName.test(actualData.name))
        {
          setError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
          return
        }
        //4. valid contact - regex check
        else if (!regPhone.test(actualData.contact))
        {
          setError({ status: true, msg: "contact field is incorrectly filled", type: 'error' })
          return
        }
        //5. valid vaadhar - regex check
        else if (!regVAadhar.test(actualData.vAadhar))
        {
          setError({ status: true, msg: "virtual aadhar field is incorrectly filled", type: 'error' })
          return
        }
        else if (!regVAadhar1.test(actualData.image1Path))
        {
          setError({ status: true, msg: "image 1 path field is incorrectly filled", type: 'error' })
          return
        }
        else if (!regVAadhar2.test(actualData.image2Path))
        {
          setError({ status: true, msg: "image 2 path field is incorrectly filled", type: 'error' })
          return
        }
      }
      /*const actualData = {
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
      }*/
      ////console.log(actualData)
      
      const res = await changeUserPassword({actualData})

      if (res.error)
      {
        ////console.log(res.error.data.errors) //from renderers.js file backend
        ////console.log("ENTER1", res.error)
        setError({ status: true, msg: res.error.data, type: 'error' })
      }
      else
      {
        setError({ status: true, msg: "Filled correctly", type: 'success' })
        //3. remove text fields in box
        setVisibleItem('')
      }
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

        {visibleItem=='PT' && 
          <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='name' name='name' label='Name' defaultValue ={userInfo['name']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' defaultValue={userInfo['contact']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' value={userInfo['vAadhar']}/>
          
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>
          </Box>
          
          {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
        </Box>}
        {(visibleItem=='HS' || visibleItem=='PH' || visibleItem=='IF') &&
          <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='name' name='name' label='Name' defaultValue ={userInfo['name']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='address' name='address' label='address' defaultValue={userInfo['address']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' defaultValue={userInfo['contact']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' defaultValue={userInfo['healthLicense']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='description' name='description' label='description' defaultValue={userInfo['description']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='location' name='location' label='location' defaultValue={userInfo['location']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image1Path' name='image1Path' label='image1Path' defaultValue={userInfo['image1Path']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image2Path' name='image2Path' label='image2Path' defaultValue={userInfo['image2Path']}/>
    
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>
          </Box>
          {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
        </Box>}
        {visibleItem=='HP' && 
          <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='name' name='name' label='Name' defaultValue ={userInfo['name']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' defaultValue={userInfo['contact']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' defaultValue={userInfo['vAadhar']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' defaultValue={userInfo['healthLicense']}/>
          
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>
          </Box>
          {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
        </Box>}
        {(visibleItem=='AD') &&
          <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='name' name='name' label='Name' defaultValue ={userInfo['name']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='address' name='address' label='address' defaultValue={userInfo['address']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' defaultValue={userInfo['contact']} />
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' defaultValue={userInfo['vAadhar']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' defaultValue={userInfo['healthLicense']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='description' name='description' label='description' defaultValue={userInfo['description']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='location' name='location' label='location' defaultValue={userInfo['location']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image1Path' name='image1Path' label='image1Path' defaultValue={userInfo['image1Path']}/>
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image2Path' name='image2Path' label='image2Path' defaultValue={userInfo['image2Path']}/>
    
          <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>
          </Box>
          {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
        </Box>}
        </Grid>
      </Grid>
    </>;

};

export default Profile;