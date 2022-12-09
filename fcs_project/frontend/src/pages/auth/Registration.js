import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useOtpGeneratorMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/localStorageService';
import { storeUser } from '../../services/localStorageService';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const Registration = () => {
  //const [server_error, setServerError] = useState({status: false, msg: "", type: ""})
  const [error, setError] = useState({status: false, msg: "", type: ""})
  const [notes, setNotes] = useState('PT');
  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterUserMutation()
  const [OtpGenerator] = useOtpGeneratorMutation()
  const [otp, setOtp] = useState('');

  var regName = /\d+$/g; 
  var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  var regPhone=/^\d{10}$/;
  var regVAadhar=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regVAadhar1=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regVAadhar2=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regOtp=/^[A-Z0-9]{8}$/;
  var regPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  const handleOTP = async () => {
    ////console.log("Clicked generate OTP");
    let emailOTP = document.getElementById("email").value;
    ////console.log(emailOTP)
    //api call to generateOTPRegistration
    const actualData = {
    userEmail: emailOTP,
    }
    const res = await OtpGenerator(actualData)
    if (res.error)
    {
      ////console.log(res.error.data.errors) //from renderers.js file backend
    }
    if (res.data)
    {
      ////console.log(res.data)
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
    setNotes(temprole)    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    var actualData = {}
    ////console.log("ROLE: ", data.get('role'))
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
        image1Path: "www.google.com",
        image2Path: "www.google.com",
        status: 'NA',
        otp:otp,
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
        vAadhar: "www.google.com",
        healthLicense: data.get('healthLicense'),
        description: data.get('description'),
        location: data.get('location'),
        image1Path: data.get('image1Path'),
        image2Path: data.get('image2Path'),
        status: 'NA',
        otp:otp,
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
        image1Path: "www.google.com",
        image2Path: "www.google.com",
        status: 'NA',
        otp:otp,
      }
    }
    ////console.log(actualData)
    //client side form validation
    //1. valid name - regex check
    if (regName.test(actualData.name))
    {
      setError({ status: true, msg: "Name field is incorrectly filled", type: 'error' })
      return
    }
    //2. valid email - regex check
    else if (!regEmail.test(actualData.email))
    {
      setError({ status: true, msg: "Email field is incorrectly filled", type: 'error' })
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
    //6. valid password
    else if (!regPassword.test(actualData.password))
    {
      setError({ status: true, msg: "password field must have atleast a number and a special character and have 6-16 valid characters", type: 'error' })
      return
    }
    //empty out error after validation done
    const res = await registerUser(actualData)
    ////console.log("RES", res)
    if (res.error)
    {
      //////console.log(res.error.data.errors) //from renderers.js file backend
      setError({ status: true, msg: res.error.data, type: 'error' })
    }
    else
    {
      setError({ status: true, msg: "Filled correctly", type: 'success' })
    }
    if (res.data)
    {
      ////console.log(res.data)
      //save token
      storeToken(res.data.token)
      //storeUser(actualData)
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
      <div>
        <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='email' name='email' label='Email Address' />
        <Button variant='contained' color='warning' size='large' onClick={handleOTP} sx={{ mt: 8 }}>Verify Email</Button>
        <TextField margin='normal' value={otp} required fullWidth id='otp' name='otp' label='otp' inputProps={
          { readOnly: true, }
        } />
        <Keyboard 
                layout={{
                  'default': [
                    '1 2 3 4 5 6 7 8 9 0 {bksp}',
                    'Q W E R T Y U I O P',
                    'A S D F G H J K L',
                    'Z X C V B N M',
                  ]
                  }}
                  onChange={(input) => setOtp(input)}
          />
      </div>
      <select id='role' name='role' onChange={()=>roleDependentForm()}>
        <option value="PT">Patient</option>
        <option value="HP">Healthcare Professional</option>
        <option value="HS">Hospital</option>
        <option value="PH">Pharmacy</option>
        <option value="IF">Insurance Firm</option>
      </select>
      {notes=='PT' && 
      <div>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' />
      </div>
      }
      {(notes=='HS' || notes=='PH' || notes=='IF') &&
      <div>
        <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='address' name='address' label='address' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='description' name='description' label='description'/>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='location' name='location' label='location' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image1Path' name='image1Path' label='image1Path' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image2Path' name='image2Path' label='image2Path' />
      </div>
      }
      {notes=='HP' && 
      <div>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      </div>}
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password' name='password' label='Password' type='password' />
      
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='password2' name='password2' label='Confirm Password' type='password' />
      
      <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to standard terms and conditions" />
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
      </Box>
      {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
    </Box>
  </>;
};

export default Registration;
