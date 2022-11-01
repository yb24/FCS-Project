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
  if (access_token != null) {
    userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 
    console.log("userid", userID)
    console.log(useremail)
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
      document.getElementById("add_profile").innerHTML = "<p>"+" Email:"+res.data['email']+"<br> Name:"+res.data['name']+"<br> Role:"+res.data['role']+"<br> Address:"+res.data['address']+"<br> contact:"+res.data['contact']+"<br> description:"+res.data['description']+"<br> healthLicense:"+res.data['healthLicense']+"<br> location:"+res.data['location']+"<br> vAadhar:"+res.data['vAadhar']+"</p>"
    }
  }
  return <>
    <Grid container justifyContent='center'>
      <Grid item sm={10}>
        <h1>Dashboard</h1>
        <hr />
        {useremail != null && 
        <>
        <p>Hello {useremail}</p> 
        <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
        <Button variant='contained' color='warning' size='large' onClick={handleProfile} sx={{ mt: 8 }}>Profile</Button>
        <div id="add_profile"></div>
        </>
        }
        {useremail == null && <p>You are not logged in</p>}
      </Grid>
    </Grid>
  </>;
};

export default Home;
