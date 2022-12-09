import React, {useState, useEffect} from 'react';
import {Button, TextField} from '@mui/material';
import { getToken } from '../services/localStorageService';
import axios from "axios";
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';

function Wallet(){

    const navigate = useNavigate()
    const [currBalance, setCurrBalance] = useState(0);
    const [addAmount, setAddAmount] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');

     //role based access control
     let {access_token} = getToken()
     var role = ''
     useEffect(() => {
       if(!access_token)
       {
        navigate("../../")
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
             if (!(role=='PT' || role=='PH' || role=='IF' || role=="AD") || response.data.userStatus!="AU")
             {
                navigate("../../")
             }
             else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PatientView/Wallet'.toLowerCase() && !(role=="PT" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PharmacyView/Wallet'.toLowerCase() && !(role=="PH" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/InsuranceFirmView/Wallet'.toLowerCase() && !(role=="IF" || role=="AD"))
            {
              navigate("../../")
            }
         }).catch((error) => {
            navigate("../../")
         })
     }, []); 

    function GetCurrBalance(){
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/get_curr_balance`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            //console.log(data)
            setCurrBalance(data)
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response);
              }
          })
    }

    function AddMoneyToWallet(){
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/add_money`,
            data:{
                token: access_token,
                amount: addAmount
            }
          }).then((response)=>{
            const data = response.data
            //console.log(data)
            GetCurrBalance();
            setResponseMessage("Amount added successfully");
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response);
              setResponseMessage("Amount could not be added.");
              }
          })
    }

    useEffect(()=>{
        GetCurrBalance();
    },[])



    return(
        <div style={{margin:10, justifyContent:'center'}}>
            
            <h3>Current Balance: {currBalance}</h3>
            <br></br>
            <h4>Add money to wallet:</h4>
            <br></br>
            <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Amount"
                variant="standard"
                onChange={(e)=>setAddAmount(e.target.value)}
            />
            <Button variant = "contained" onClick={AddMoneyToWallet}>
                  Add Amount
            </Button>
            <p>{responseMessage}</p>
       
        </div>
    )

}


export default Wallet;