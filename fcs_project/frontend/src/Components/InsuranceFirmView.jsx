import React, {useState, useEffect} from 'react';
import {Grid, Button} from '@mui/material';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import axios from 'axios';


function InsuranceFirmView(){

    const navigate = useNavigate();
    //role based access control
    let {access_token} = getToken()
    var role = ''
    useEffect(() => {
      if(!access_token)
      {
        navigate("../")
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
            if (!(role=="IF" || role=="AD") || response.data.userStatus!="AU")
            {
                navigate("../")
            }
        }).catch((error) => {
        })
    }, []); 

    const navigateToProfile = () => {
        // navigate to Healthcare professionals
        navigate('Profile');
    };
    const navigateToWallet = () => {
        // navigate to Healthcare professionals
        navigate('Wallet');
    };
    const navigateToMyDocuments = () => {
        // navigate to My Documents
        navigate('MyDocuments');
    };
    const navigateToSharedDocuments = () => {
        // navigate to Shared Documents
        navigate('SharedDocuments');
    };
    const navigateToPaymentsToBeMade = () => {
        // navigate to Shared Documents
        navigate('PaymentsToBeMade');
    };
    const navigateToMakeBill = () => {
        // navigate to Shared Documents
        navigate('MakeBill');
    };


    return(
        <div style={{margin:10, justifyContent:'center'}}>
            <Grid
                container
                direction="column"
                justifyContent="center"
                spacing={10}
            >
               <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToProfile}>Profile</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToWallet}>Wallet</Button>
                </Grid>
                
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToMyDocuments}>My Documents</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToSharedDocuments}>Documents Shared With Me</Button>
                    
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToMakeBill}>Make Bill</Button>
                    
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToPaymentsToBeMade}>Payments To Be Made</Button>
                </Grid>
                
            </Grid>


        </div>
    )

}


export default InsuranceFirmView;