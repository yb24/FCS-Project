import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';


function PaymentsToBeMade(){


    const [payments, setPayments] = useState([]);

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState(null);


    let {access_token, refresh_token} = getToken()
    let userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 

    const FetchPayments  =()=>{

      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/display_payments_to_be_made`,
        data:{
            token: access_token,
            userID: userID
        }
      }).then((response)=>{
        const data = response.data
        console.log(data)
        setPayments(data)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          }
      })
    }

    useEffect(()=>{

        FetchPayments()
        
    }, [])




    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleDialog=(report)=>{
        console.log(report)
        if(report.length==0) return;
        setShowDialog(true);
        handleClickOpen();
     }


    
     const getEmailIDandAmount=(id)=>{
        if(!id)return [0,0];
        console.log("ho raha hai")
        for(var i=0; i<payments.length; i++){

            if(payments[i]['id']===id){
                return [payments[i]['receiverEmail'], payments[i]['amount']]
            }
        }
        
     }

     

     const handlePayButton=()=>{
      if(showOtpInput){
        MakePayment(selectionModel[0]);
        handleClose(); 
        setShowOtpInput(false);
        setOtp(null);
      }
      else{
        GenerateOtp();
      }
     }


     const GenerateOtp=()=>{
      setShowOtpInput(true);
      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/generate_otp`,
        data:{
            token: access_token,
            userID: userID
        }
      }).then((response)=>{
        const data = response.data
        console.log(data)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          }
      })
      return true;
     }

     const MakePayment=(id)=>{
        // id is payment_id
        //API call to make status in payment table 'Paid'
        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/make_payment`,
          data:{
              token: access_token,
              userID: userID,
              paymentID: id,
              otp : otp
          }
        }).then((response)=>{
          const data = response.data
          console.log(data)
          FetchPayments()
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            }
        })
        return
     }


      function PaymentsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'Payments',
              }}/>
          </GridToolbarContainer>
        );
      }


      const paymentsColumns = [
        { field: 'receiverEmail', headerName: 'Email ID of Receiver', width: 300 },
        { field: 'amount', headerName: 'Bill Amount', width:300 },
        { field: 'status', headerName: 'Status', width:300 },
      ];



    return(
        <div style={{margin:10, justifyContent:'center'}}>

           <div style={{ height: 300, width: '100%' }} >
         Payments
            <DataGrid 
                rows={payments}
                columns={paymentsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: PaymentsFilters,}}
                onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
                }}
                selectionModel={selectionModel}
            />
         

         <Button variant = "contained" onClick={()=>handleDialog(selectionModel)}>
                  Make Payment
            </Button>

        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
         
            {
        showDialog?(
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogContent>
              <DialogContentText>
               {/* Paying to : {getEmailIDandAmount(selectionModel[0])[0]}
               <br></br>
               Amount: {getEmailIDandAmount(selectionModel[0])[1]} */}
               {showOtpInput?"Enter OTP":""}
              </DialogContentText>
              {showOtpInput?
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Enter OTP"
                fullWidth
                variant="standard"
                onChange={(e)=>setOtp(e.target.value)}
              />
               :""}
               
              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handlePayButton}>{showOtpInput?"Pay":"Generate OTP"}</Button>
            </DialogActions>
          </Dialog>
        </div>):""}

        </div>
    )

}


export default PaymentsToBeMade;