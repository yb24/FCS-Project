import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { getToken } from '../services/localStorageService';

function MakeBill(){


    const [sharedDocuments, setSharedDocuments] = useState([])

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(null)

    let {access_token, refresh_token} = getToken()
    let userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 

    const FetchSharedDocuments  =()=>{

      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/display_unmade_bills`,
        data:{
            token: access_token,
            userID: userID,
            role: 'PH'
        }
      }).then((response)=>{
        const data = response.data
        console.log(data)
        setSharedDocuments(data)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          }
      })
    }

    useEffect(()=>{

        FetchSharedDocuments()
        
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



     const getEmailID=(id)=>{

        for(var i=0; i<sharedDocuments.length; i++){

            if(sharedDocuments[i]['id']==id){
                return sharedDocuments[i]['sharedBy']
            }
        }
        
     }




     const MakeBill=(id, sharedByEmail, billAmount)=>{
        console.log(id, sharedByEmail, billAmount)
        if(!id || !sharedByEmail || !billAmount) return;

        // id is shareID
        console.log("harman ludo")
        //API call to make 'Bill Made' in payment table 'Yes'
        

        //API call to make an entry in payment_table

        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/make_bill`,
          data:{
              token: access_token,
              userID: userID,
              sharedByEmail : sharedByEmail,
              sharedRecordID: id,
              amount: billAmount,
              role: 'PH'
          }
        }).then((response)=>{
          const data = response.data
          console.log(data)
          FetchSharedDocuments();
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            }
        })

        return
     }


      function SharedDocumentsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'Shared Documents',
              }}/>
          </GridToolbarContainer>
        );
      }


      const sharedDocumentsColumns = [
        { field: 'type', headerName: 'Type of Document', width: 300 },
        { field: 'doc', headerName: 'Document', width:300 },
        { field: 'sharedBy', headerName: 'Shared By', width:300 },
        { field: 'billMade', headerName: 'Bill Made', width:300 },
      ];



    return(
        <div style={{margin:10, justifyContent:'center'}}>

           <div style={{ height: 300, width: '100%' }} >
         Pending Bills
            <DataGrid 
                rows={sharedDocuments}
                columns={sharedDocumentsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: SharedDocumentsFilters,}}
                onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
                }}
                selectionModel={selectionModel}
            />

        <Button variant = "contained" onClick={()=>handleDialog(selectionModel)}>
                  Make Bill
            </Button>

         

        </div>

        {
        showDialog?(
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Make Bill</DialogTitle>
            <DialogContent>
              <DialogContentText>
               Amount:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Amount"
                fullWidth
                variant="standard"
                onChange={(e)=>setAmount(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={()=>{MakeBill(selectionModel[0], getEmailID(selectionModel[0]), amount);handleClose()}}>Share</Button>
            </DialogActions>
          </Dialog>
        </div>):""}

        </div>
    )

}


export default MakeBill;