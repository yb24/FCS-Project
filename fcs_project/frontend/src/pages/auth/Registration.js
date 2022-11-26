import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useOtpGeneratorMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/localStorageService';
import { storeUser } from '../../services/localStorageService';

const Registration = () => {
  const [server_error, setServerError] = useState({})
  const [client_error, setClientError] = useState({status: false, msg: "", type: ""})
  const [notes, setNotes] = useState(['contact','vAadhar']);
  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterUserMutation()
  const [OtpGenerator] = useOtpGeneratorMutation()
  var regName = /\d+$/g; 
  var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  var regPhone=/^\d{10}$/;
  var regVAadhar=/^\d{16}$/;

  const handleOTP = async () => {
    console.log("Clicked generate OTP");
    let emailOTP = document.getElementById("email").value;
    console.log(emailOTP)
    //api call to generateOTPRegistration
    const actualData = {
    userEmail: emailOTP,
    }
    const res = await OtpGenerator(actualData)
    if (res.error)
    {
      console.log(res.error.data.errors) //from renderers.js file backend
    }
    if (res.data)
    {
      console.log(res.data)
    }
  }
  function roleDependentForm() {
    /*
    <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='address' name='address' label='address' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='description' name='description' label='description'/>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='location' name='location' label='location' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image1Path' name='image1Path' label='image1Path' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image2Path' name='image2Path' label='image2Path' />
    */
    var temprole = document.getElementById('role').value
    //1. patient 
    if (temprole=='PT')
    {
      console.log("entered PT")
      //add elms to div roleBasedAddition
      notes.length=0
      setNotes(notes)
      notes.push('contact');
      notes.push('vAadhar');
      console.log(notes)
      setNotes([ ...notes ]);
    }
    //2. hs, ph, if
    else if (temprole=='HS' || temprole=='PH' || temprole=='IF')
    {
      console.log("entered org")
      notes.length=0
      setNotes(notes)
      notes.push('contact');
      notes.push('address');
      notes.push('healthLicense');
      notes.push('description');
      notes.push('location');
      notes.push('image1Path');
      notes.push('image2Path');
      console.log(notes)
      setNotes([ ...notes ]);
    }
    //3. hp 
    else if (temprole=='HP')
    {
      console.log("entered HP")
      notes.length=0
      setNotes(notes)
      notes.push('contact');
      notes.push('vAadhar');
      notes.push('healthLicense');
      console.log(notes)
      setNotes([ ...notes ]);
    }
    //4. ad - TO HANDLE?
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    var actualData = {}
    if (data.get('role')=='PT')
    {
      actualData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        password2: data.get('password2'),
        tc: data.get('tc'),
        role: data.get('role'),
        address: "NA",
        contact: data.get('contact'),
        vAadhar: data.get('vAadhar'),
        healthLicense: "NA",
        description: "NA",
        location: "NA",
        image1Path: "NA",
        image2Path: "NA",
        status: 'NA',
        otp:data.get('otp'),
      }
    }
    else if (data.get('role')=='HS' || data.get('role')=='PH' || data.get('role')=='IF')
    {
      actualData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        password2: data.get('password2'),
        tc: data.get('tc'),
        role: data.get('role'),
        address: data.get('address'),
        contact: data.get('contact'),
        vAadhar: "NA",
        healthLicense: data.get('healthLicense'),
        description: data.get('description'),
        location: data.get('location'),
        image1Path: data.get('image1Path'),
        image2Path: data.get('image2Path'),
        status: 'NA',
        otp:data.get('otp'),
      }
    }
    else if (data.get('role')=='HP')
    {
      actualData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        password2: data.get('password2'),
        tc: data.get('tc'),
        role: data.get('role'),
        address: "NA",
        contact: data.get('contact'),
        vAadhar: data.get('vAadhar'),
        healthLicense: data.get('healthLicense'),
        description: "NA",
        location: "NA",
        image1Path: "NA",
        image2Path: "NA",
        status: 'NA',
        otp:data.get('otp'),
      }
    }
    console.log(actualData)
    //client side form validation
    //1. valid name - regex check
    if (regName.test(actualData.name))
    {
      setClientError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
      return
    }
    //2. valid email - regex check
    else if (!regEmail.test(actualData.email))
    {
      setClientError({ status: true, msg: "Email field is incorrectly filled", type: 'error' })
      return
    }
    //3. valid otp - numeric
    else if (isNaN(actualData.otp))
    {
      setClientError({ status: true, msg: "otp field is incorrectly filled", type: 'error' })
      return
    }
    //4. valid contact - regex check
    else if (!regPhone.test(actualData.contact))
    {
      setClientError({ status: true, msg: "contact field is incorrectly filled", type: 'error' })
      return
    }
    //5. valid vaadhar - regex check
    else if (!regVAadhar.test(actualData.vAadhar))
    {
      setClientError({ status: true, msg: "virtual aadhar field is incorrectly filled", type: 'error' })
      return
    }
    else
    {
      setClientError({ status: true, msg: "Filled correctly", type: 'success' })
      
    }
    //empty out error after validation done
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
      //redirect based on user role
      navigate('../')
      /*if (res_temp.data['status']=='NA' || res_temp.data['status']=='RM')
      {
        navigate('../')
      }
      if (actualData['role']=='PT')
      {
        navigate('PatientView/')
      }
      else if (actualData['role']=='HP')
      {
        navigate('HealthcareProfessioanlView/')
      }
      else if (actualData['role']=='HS')
      {
        navigate('HospitalView/')
      }
      else if (actualData['role']=='PH')
      {
        navigate('PharmacyView/')
      }
      else if (actualData['role']=='IF')
      {
        navigate('InsuranceFirmView/')
      }
      else
      {
        navigate('/')
      }*/
    }
  }
  return <>
    <Box style={{'overflow' : 'scroll', 'height': '75vh'}} component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='name' name='name' label='Name' />
      {server_error.name ? <Typography>{server_error.name[0]}</Typography> : ""}
      <div>
        <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='email' name='email' label='Email Address' />
        <Button variant='contained' color='warning' size='large' onClick={handleOTP} sx={{ mt: 8 }}>Verify Email</Button>
        <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='otp' name='otp' label='otp' />
      </div>
      {server_error.email ? <Typography>{server_error.email[0]}</Typography> : ""}
      <select id='role' name='role' onChange={()=>roleDependentForm()}>
        <option value="PT">Patient</option>
        <option value="HP">Healthcare Professional</option>
        <option value="HS">Hospital</option>
        <option value="PH">Pharmacy</option>
        <option value="IF">Insurance Firm</option>
      </select>
      <div id="roleBasedAddition">
      {notes.map((item, index)=> {
                return <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth key={index} id={item} name={item} label={item}/>
            })
        }
      </div>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password ? <Typography>{server_error.password[0]}</Typography> : ""}
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password2' name='password2' label='Confirm Password' type='password' />
      {server_error.password2 ? <Typography>{server_error.password2[0]}</Typography> : ""}
      <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to term and condition." />
      {server_error.tc ? <Typography>{server_error.tc[0]}</Typography> : ""}
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
      </Box>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
      {client_error.status ? <Alert severity={client_error.type}>{client_error.msg}</Alert> : ''}
    </Box>
  </>;
};

export default Registration;
