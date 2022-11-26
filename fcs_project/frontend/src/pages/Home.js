import { Button, Grid } from "@mui/material";
import { getUser } from '../services/localStorageService';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUser, getToken } from '../services/localStorageService';
import { useProfileUserMutation } from '../services/userAuthApi'

const Home = () => {
  const [profileUser, {isLoading}] = useProfileUserMutation()
  let {username, useremail} = getUser()
  //1. get decoded userid
  let {access_token, refresh_token} = getToken()
  console.log(access_token)
  let userID = ""

  let status1 = "AU"
  console.log("status : ", status1)
  if (access_token != null) {
    userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 
    console.log("userid", userID)
    //also get the status
    const actualData1 = {
      id: userID,
    }

    //const res1 = await profileUser(actualData1)
    //status1 = 'AU'//res1.data['status']
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
      document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"<br> Image1Path:"+res.data['image1Path']+"<br> Image2Path:"+res.data['image2Path']+"</p>"
    }
  }

  const handleExplore = async () => {
    console.log("Explore Clicked");
    //navigate based on role?
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
      console.log("home page",res.data)
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
          navigate('/')
        }
      }
    }
  }

  return <>
    <Grid container justifyContent='center'>
      <Grid item sm={10}>
        <h1>Dashboard</h1>
        <hr />
        {useremail == null && <p>You are not logged in</p>}
        {status1 == 'NA' && <p>You are not authenticated</p>}
        {status1 == 'RM' && <p>You have been removed from the system</p>}
        {status1=='AU' && useremail != null && 
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
