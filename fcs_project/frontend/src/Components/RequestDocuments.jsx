import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import {Button, InputLabel, MenuItem, FormControl, Select, TextField} from '@mui/material';
import { getToken } from '../services/localStorageService';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

function RequestDocuments(){

  const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());
    const [type, setType] = useState('');
    const [email, setEmail] = useState(null);
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
             if (!(role=="PT" || role=="AD") || response.data.userStatus!="AU")
             {
              navigate("../../")
             }
         }).catch((error) => {
          navigate("../../")
         })
     }, []); 
 

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const RequestDocument = (type, date, email) =>{

        if(!type || !date || !email) return;
       
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/request_documents`,
            data:{
                token: access_token,
                docType: type,
                date: date,
                receiverEmail: email
            }
          }).then((response)=>{
            const data = response.data
            setType(null);
            setEmail(null);
            setStartDate(new Date());
            setResponseMessage("Document requested successfully!")
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response.data);
            }
            setResponseMessage("Error in requesting document!")

          })
    };

    return(
        <div>

            <FormControl sx={{ m: 1, minWidth: 170 }}>
                <InputLabel id="type-select">Type of Document</InputLabel>
                <Select
                labelId="type-select"
                id="select"
                value={type}
                label="Type"
                onChange={handleChangeType}
                >
                <MenuItem value={"prescription"}>Prescription</MenuItem>
                <MenuItem value={"test_result"}>Test Result</MenuItem>
                <MenuItem value={"bill"}>Bill</MenuItem>
                <MenuItem value={"insurance_document"}>Insurance Document</MenuItem>
                <MenuItem value={"discharge_summary"}>Discharge Summary</MenuItem>
                </Select>
            </FormControl>

            <br></br>
            <br></br>

            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

            <br></br>
            <br></br>

            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Emai ID of the Healtchare Professional/Hospital"
                type="email"
                variant="standard"
                onChange={(e)=>setEmail(e.target.value)}
              />

            <br></br>
            <br></br>

            <Button variant = "contained" onClick={()=>RequestDocument(type, startDate, email)}>
                  Request Document
            </Button>

            <br></br>
            <br></br>

            <p>{responseMessage}</p>
            
        </div>

    )

}


export default RequestDocuments;














































































