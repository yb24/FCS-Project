import React, {useState, useEffect} from 'react';
import {Grid, Button} from '@mui/material';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';


function HospitalView(){

    const navigate = useNavigate();


    const navigateToProfile = () => {
        // navigate to Healthcare professionals
        navigate('Profile');
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
                    <Button variant="contained" onClick={navigateToProfile}>Profile</Button>
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


export default HospitalView;