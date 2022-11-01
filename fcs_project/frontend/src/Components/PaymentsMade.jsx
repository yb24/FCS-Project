import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";



function PaymentsMade(){


    const [payments, setPayments] = useState([]);

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    const FetchPayments  =()=>{

        setPayments([
            {'email':'harman.iiit@gmail.com', 'amount':'40', 'status':'Not Paid', 'id':101},
           
        ])
    }

    useEffect(()=>{

        FetchPayments()
        
    }, [payments])




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

        for(var i=0; i<payments.length; i++){

            if(payments[i]['id']===id){
                return [payments[i]['email'], payments[i]['amount']]
            }
        }
        
     }


     const MakePayment=(id)=>{

        //API call to make status 'Paid'
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
        { field: 'email', headerName: 'Email ID of Receiver', width: 300 },
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
               Paying to : {getEmailIDandAmount(selectionModel[0])[0]}
               <br></br>
               Amount: {getEmailIDandAmount(selectionModel[0])[1]}
              </DialogContentText>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={()=>{MakePayment(selectionModel[0]);handleClose()}}>Pay</Button>
            </DialogActions>
          </Dialog>
        </div>):""}

        </div>
    )

}


export default PaymentsMade;