import React, {useState, useEffect} from 'react';
import {Grid, Button} from '@mui/material';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../services/localStorageService';

function PatientView(){

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
            if (!(role=="PT" || role=="AD") || response.data.userStatus!="AU")
            {
                navigate("../")
            }
        }).catch((error) => {
            navigate("../")
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
    const navigateToHealthCareProfessionals = () => {
        // navigate to Healthcare professionals
        navigate('HealthcareProfessionals');
    };
    const navigateToHospitals = () => {
        // navigate to Hospitals
        navigate('Hospitals');
    };
    const navigateToPharmacies = () => {
        // navigate to Pharmacies
        navigate('Pharmacies');
    };
    const navigateToInsuranceFirms = () => {
        // navigate to Insurance Firms
        navigate('InsuranceFirms');
    };
    const navigateToMyDocuments = () => {
        // navigate to My Documents
        navigate('MyDocuments');
    };
    const navigateToRequestDocuments = () => {
        // navigate to My Documents
        navigate('RequestDocuments');
    };
    const navigateToSharedDocuments = () => {
        // navigate to Shared Documents
        navigate('SharedDocuments');
    };
    const navigateToPaymentsToBeMade = () => {
        // navigate to Shared Documents
        navigate('PaymentsToBeMade');
    };
    const navigateToAllPayments= () => {
        // navigate to Shared Documents
        navigate('AllPayments');
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
                    <Button variant="contained" onClick={navigateToHealthCareProfessionals}>Healthcare Professionals</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToHospitals}>Hospitals</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToPharmacies}>Pharmacies</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToInsuranceFirms}>Insurance Firms</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToMyDocuments}>My Documents</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToRequestDocuments}>Request Documents</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToSharedDocuments}>Documents Shared With Me</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToPaymentsToBeMade}>Payments To Be Made</Button>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Button variant="contained" onClick={navigateToAllPayments}>All Payments</Button>
                </Grid>
            </Grid>


        </div>
    )

}


export default PatientView;