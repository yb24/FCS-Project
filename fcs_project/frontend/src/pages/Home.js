import { Button, Grid } from "@mui/material";
import { getUser } from '../services/localStorageService';
import { useNavigate } from 'react-router-dom';
import { removeToken, removeUser } from '../services/localStorageService';

const Home = () => {
  let {username, useremail} = getUser()
  console.log(useremail)
  const navigate = useNavigate()
  const handleLogout = () => {
    console.log("Logout Clicked");
    //remove tokens
    removeToken()
    removeUser()
    navigate('/login')
  }
  return <>
    <Grid container justifyContent='center'>
      <Grid item sm={10}>
        <h1>Home Page</h1>
        <hr />
        {useremail != null && 
        <>
        <p>Hello {useremail}</p> 
        <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
        </>
        }
        {useremail == null && <p>You are not logged in</p>}
      </Grid>
    </Grid>
  </>;
};

export default Home;
