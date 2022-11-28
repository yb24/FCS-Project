import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useOtpGeneratorMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/localStorageService';
import { storeUser } from '../../services/localStorageService';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const Registration = () => {
  const [server_error, setServerError] = useState({})
  const [client_error, setClientError] = useState({status: false, msg: "", type: ""})
  const [notes, setNotes] = useState('PT');
  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterUserMutation()
  const [OtpGenerator] = useOtpGeneratorMutation()

  const [otp, setOtp] = useState('');
  const [VID, setVID] = useState(null);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  var blob = new Blob(["empty file"],{ type: "text/plain;charset=utf-8" });
  var emptyFile  = new File(['empty', ' ', 'file'], 'emptyFile.txt', {type: 'text/plain'});

  var regName = /\d+$/g; 
  var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  var regPhone=/^\d{10}$/;
  var regOtp=/^[A-Z0-9]{8}$/;

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
    setNotes(temprole)    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    var actualData = {}
    console.log("ROLE: ", data.get('role'))
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
        vAadhar: VID?VID:emptyFile,
        healthLicense: "NA",
        description: "NA",
        location: "NA",
        image1Path: emptyFile,
        image2Path: emptyFile,
        status: 'NA',
        otp:otp,
        title1: VID?VID.name:"empty file",
        title2: "empty file",
        title3: "empty file",
        content1: "File",
        content2: "File",
        content3: "File",

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
        vAadhar: new File([""],"empty file"),
        healthLicense: data.get('healthLicense'),
        description: data.get('description'),
        location: data.get('location'),
        image1Path: img1?img1:emptyFile,
        image2Path: img2?img2:emptyFile,
        status: 'NA',
        otp:otp,
        title1: "empty file",
        title2: img1?img1.name:"empty file",
        title3: img2?img2.name:"empty file",
        content1: "File",
        content2: "File",
        content3: "File",
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
        vAadhar: VID?VID:new File([""],"empty file"),
        healthLicense: data.get('healthLicense'),
        description: "NA",
        location: "NA",
        image1Path: emptyFile,
        image2Path: emptyFile,
        status: 'NA',
        otp:otp,
        title1: VID?VID.name:"empty file",
        title2: "empty file",
        title3: "empty file",
        content1: "File",
        content2: "File",
        content3: "File",
      }
    }
    console.log(VID)
    console.log(emptyFile)
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
    else if (!regOtp.test(actualData.otp))
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
    // else if (!regVAadhar.test(actualData.vAadhar))
    // {
    //   setClientError({ status: true, msg: "virtual aadhar field is incorrectly filled", type: 'error' })
    //   return
    // }
    else
    {
      setClientError({ status: true, msg: "Filled correctly", type: 'success' })
    }
    //empty out error after validation done
    let formData = new FormData();
    formData.append('name', actualData['name']);
      formData.append('email', actualData['email']);
      formData.append('password', actualData['password']);
      formData.append('password2', actualData['password2']);
      formData.append('tc', actualData['tc']);
      formData.append('role', actualData['role']);
      formData.append('address', actualData['address']);
      formData.append('contact', actualData['contact']);
      formData.append('vAadhar', actualData['vAadhar'], actualData['title1']);
      formData.append('healthLicense', actualData['healthLicense']);
      formData.append('description', actualData['description']);
      formData.append('location', actualData['location']);
      formData.append('image1Path', actualData['image1Path'], actualData['title2']);
      formData.append('image2Path', actualData['image2Path'], actualData['title3']);
      formData.append('status', actualData['status']);
      formData.append('otp', actualData['otp']);
      formData.append('title1', actualData['title1']);
      formData.append('title2', actualData['title2']);
      formData.append('title3', actualData['title3']);
      formData.append('content1', actualData['content1']);
      formData.append('content2', actualData['content2']);
      formData.append('content3', actualData['content3']);


      console.log(formData);
    const res = await registerUser(formData)
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
      {server_error.name ? <Typography>{server_error.name[0]}</Typography> : ""}
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
      {server_error.email ? <Typography>{server_error.email[0]}</Typography> : ""}
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
      <label>Aadhar Card</label><input type="file" onChange={(e)=>setVID(e.target.files[0])} />
      </div>
      }
      {(notes=='HS' || notes=='PH' || notes=='IF') &&
      <div>
        <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='address' name='address' label='address' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='description' name='description' label='description'/>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='location' name='location' label='location' />
      {/* <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image1Path' name='image1Path' label='image1Path' />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='image2Path' name='image2Path' label='image2Path' /> */}
      <label>Image 1</label><input type="file" onChange={(e)=> setImg1(e.target.files[0])} />
      <label>Image 2</label><input type="file" onChange={(e)=> setImg2(e.target.files[0])} />
      </div>
      }
      {notes=='HP' && 
      <div>
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='contact' name='contact' label='contact' />
      {/* <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='vAadhar' name='vAadhar' label='virtual Aadhar' /> */}
      <label>Aadhar Card</label><input type="file" onChange={(e)=>setVID(e.target.files[0])} />
      <TextField margin='normal' required inputProps={{ maxLength: 100 }} fullWidth id='healthLicense' name='healthLicense' label='healthLicense' />
      </div>}
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
