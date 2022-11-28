import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css'
import {useNavigate} from 'react-router-dom';

function PaymentsToBeMade(){


    const [payments, setPayments] = useState([]);

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState(null);


    let {access_token} = getToken();
    //role based access control
    const navigate = useNavigate();
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
            if (!(role=="PT" || role=="IF" || role=="AD") || response.data.userStatus!="AU")
            {
                navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PatientView/PaymentsToBeMade'.toLowerCase() && !(role=="PT" || role=="AD"))
            {
              navigate("../../")
            }
            else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/InsuranceFirmView/PaymentsToBeMade'.toLowerCase() && !(role=="IF" || role=="AD"))
            {
              navigate("../../")
            }

        }).catch((error) => {
          navigate("../../")
        })
    }, []); 

    const FetchPayments  =()=>{

      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/display_payments_to_be_made`,
        data:{
            token: access_token,
        }
      }).then((response)=>{
        const data = response.data
        setPayments(data)
      }).catch((error) => {
        if (error.response) {
          //console.log(error.response.data);
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
        //console.log(report)
        if(report.length==0) return;
        setShowDialog(true);
        handleClickOpen();
     }


    
     const getEmailIDandAmount=(id)=>{
        if(!id)return [0,0];
        //console.log("ho raha hai")
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
        }
      }).then((response)=>{
        const data = response.data
      }).catch((error) => {
        if (error.response) {
          //console.log(error.response.data);
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
              paymentID: id,
              otp : otp
          }
        }).then((response)=>{
          const data = response.data
          FetchPayments()
        }).catch((error) => {
          if (error.response) {
            //console.log(error.response.data);
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
        { field: 'receiverEmail', headerName: 'Email ID of Receiver', width: 600 },
        { field: 'amount', headerName: 'Bill Amount', width:600 },
        { field: 'status', headerName: 'Status', width:600 },
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
               {showOtpInput?<p>{otp}</p>:""}
              </DialogContentText>
              {showOtpInput?
                 <Keyboard 
                 layout={{
                   'default': [
                     '1 2 3 4 5 6 7 8 9 0 {bksp}',
                     'Q W E R T Y U I O P',
                     'A S D F G H J K L',
                     'Z X C V B N M',
                   ]
                   }}
                   onChange={(input) => setOtp(input)}
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