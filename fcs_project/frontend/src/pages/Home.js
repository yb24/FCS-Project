import { Button, Grid } from "@mui/material";
import { getUser } from '../services/localStorageService';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUser, getToken } from '../services/localStorageService';
import { useProfileUserMutation } from '../services/userAuthApi'
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Home = () => {
  const [profileUser, {isLoading}] = useProfileUserMutation()
  //1. get decoded userid
  let {access_token} = getToken()
  ////console.log(access_token)
  let userID = ""

  let status1 = "AU"
  ////console.log("status : ", status1)
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
    //also get the status

    //const res1 = await profileUser(actualData1)
    //status1 = 'AU'//res1.data['status']
  }
  const navigate = useNavigate()
  const [useremail, setUserEmail] = useState('')
  useEffect(() => {
    if(!access_token)
      return;
      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/get_role`,
        data:{
            token: access_token,
        }
      }).then((response)=>{
          ////console.log("homejs",response.data)
          setUserEmail(response.data.email)
      }).catch((error) => {
      })
  }, []); 


  const handleLogout = () => {
    ////console.log("Logout Clicked");
    //remove tokens
    removeToken()
    //removeUser()
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
      //3. show json on page
      document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"
    }
  }

  const handleExplore = async () => {
    ////console.log("Explore Clicked");
    //navigate based on role?
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
      ////console.log("home page",res.data)
      //1. if not auth, then add para, not auth!
      if (res.data['status']=='NA')
      {
        document.getElementById("statusMessage").innerHTML = "<p>You are not authenticated by admin, please wait</p>"
      }
      //2. if auth, then role based redirect
      else if (res.data['status']=='RM')
      {
        document.getElementById("statusMessage").innerHTML = "<p>You are removed from system</p>"
      }
      else
      {
        if (res.data['role']=='PT')
        {
          navigate('PatientView/')
        }
        else if (res.data['role']=='HP')
        {
          navigate('HealthcareProfessioanlView/')
        }
        else if (res.data['role']=='HS')
        {
          navigate('HospitalView/')
        }
        else if (res.data['role']=='PH')
        {
          navigate('PharmacyView/')
        }
        else if (res.data['role']=='IF')
        {
          navigate('InsuranceFirmView/')
        }
        else
        {
          navigate('/PatientView/')
        }
      }
    }
  }

  return <>
    <Grid container justifyContent='center'>
      <Grid item sm={10}>
        <h1>Welcome!</h1>
        <p>A patient data management system is a software system developed primarily to facilitate the verification of the patients’ documents while buying medicines or making medical claims.
The focus of this project is to develop a portal that facilitates the secure exchange and verification of electronic health records. 
</p>
<hr />
        {useremail == '' && <p>You are not logged in</p>}
        {status1 == 'NA' && <p>You are not authenticated</p>}
        {status1 == 'RM' && <p>You have been removed from the system</p>}
        {status1=='AU' && useremail != '' && 
        <>
        <p>Hello {useremail}</p> 
        <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
        <Button variant='contained' color='warning' size='large' onClick={handleExplore} sx={{ mt: 8 }}>Explore Website</Button>
        <div id="add_profile"></div>
        <div id="statusMessage"></div>
        </>
        }
      </Grid>
    </Grid>
  </>;
};

//REMOVED : <Button variant='contained' color='warning' size='large' onClick={handleProfile} sx={{ mt: 8 }}>Profile</Button>
export default Home;
