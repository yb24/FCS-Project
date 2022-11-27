import React, {useState, useEffect} from 'react';
import {Grid, Button} from '@mui/material';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';

function PatientView(){

    const navigate = useNavigate();

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