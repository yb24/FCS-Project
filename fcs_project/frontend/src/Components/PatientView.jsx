import React, {useState, useEffect} from 'react';
import {Grid, Button} from '@mui/material';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import HealthcareProfessionalsList from './HealthcareProfessionalsList';

function PatientView(){

    const navigate = useNavigate();


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
    const navigateToSharedDocuments = () => {
        // navigate to Shared Documents
        navigate('SharedDocuments');
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
                    <Button variant="contained" onClick={navigateToHealthCareProfessionals}>Profile</Button>
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
                    <Button variant="contained" onClick={navigateToSharedDocuments}>Documents Shared With Me</Button>
                </Grid>
            </Grid>


        </div>
    )

}


export default PatientView;