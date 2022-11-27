import React, {useState, useEffect} from 'react';
import {Button, TextField} from '@mui/material';
import { getToken } from '../services/localStorageService';
import axios from "axios";

function Wallet(){

    const [currBalance, setCurrBalance] = useState(0);
    const [addAmount, setAddAmount] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');

    let {access_token, refresh_token} = getToken();

    function GetCurrBalance(){
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/get_curr_balance`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setCurrBalance(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
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
            console.log(data)
            GetCurrBalance();
            setResponseMessage("Amount added successfully");
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
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