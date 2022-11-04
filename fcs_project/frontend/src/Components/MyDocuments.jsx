import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';


function MyDocuments(){


    const [myDocuments, setMyDocuments] = useState([])

    const [selectedFile, setSelectedFile] = useState(null);
    const [type, setType] = useState('');
    let {access_token, refresh_token} = getToken()
    let userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 
    

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('')

    const FetchMyDocuments =()=>{
      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/display_upload_records`,
        data:{
            token: access_token,
            userID: userID,
        }
      }).then((response)=>{
        const data = response.data
        console.log(data)
        setMyDocuments(data)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          }
      })
    }

    useEffect(()=>{
        FetchMyDocuments()
    }, [])

    const handleDeleteRecord = (report_id) => {
      if(!report_id)
        return;
      axios({
        method: "DELETE",
        url:`${process.env.REACT_APP_BACKEND}/delete_upload_records`,
        data:{
            token: access_token,
            UserID:userID,
            reportID: report_id,
        }
      }).then((response)=>{
        console.log(response)
        FetchMyDocuments()
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          }
      })
      setSelectionModel([])
    }
  

    

    const handleChangeType = (event) => {
        setType(event.target.value);
    };
   
    const onFileChange = (event)=>{
        setSelectedFile(event.target.files[0]);
    }

    const onFileUpload = () => {
    
        console.log("here")
        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/insert_upload_records`,
          data:{
              token: access_token,
              userID: userID,
              docLink: docLink,
              docType: type,
          }
        }).then((response)=>{
          const data = response.data
          console.log(data)
          FetchMyDocuments()
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            }
        })
        // const formData = new FormData();
      

        // //Send token instead of userID
        // formData.append("userID", '80')
        // formData.append(
        //   "docLink",
        //   selectedFile);
        
          
        // // formData.append("token", "abcd");
        // formData.append("docType", "Prescription");
        
        // for (var [key, value] of formData.entries()) { 
        //     console.log(key, value);
        //   }
        // console.log(selectedFile);
        // console.log(...formData);
        // console.log(formData==null)

        // axios({
        //     method: "POST",
        //     url:`${process.env.REACT_APP_BACKEND}/insert_upload_records`,
        //     headers: {
        //         'content-type': 'multipart/form-data',
        //     },
        //     data:formData
        //   }).then((response)=>{
        //     const data = response.data
        //     console.log(data)
        //   }).catch((error) => {
        //     if (error.response) {
        //       console.log(error.response);
        //       }
        //   })

        //axios.post("api/uploadfile", formData);
      };

      const [docLink, setDocLink] = useState("")
      const handleDocLink = (event) =>{
        setDocLink(event.target.value)
    }


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

     const ShareMyDocument=(reportID, emailID)=>{

      if(!reportID || !emailID) return;
      //make axios call here

      axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/share_document`,
          data:{
              token: access_token,
              userID:userID,
              reportID: reportID,
              emailID : emailID
          }
        }).then((response)=>{
          console.log(response)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            }
        })

   }


      function MyDocumentsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'My Documents',
              }}/>
          </GridToolbarContainer>
        );
      }


      const myDocumentsColumns = [
        {field: 'userID', headerName: "User ID", width:300},
        { field: 'docType', headerName: 'Type of Document', width: 300 },
        { field: 'docLink', headerName: 'Document', width:300 },
      ];



    return(
        <div style={{margin:10, justifyContent:'center'}}>

           <div style={{ height: 300, width: '100%' }} >
         Documents List
            <DataGrid 
                rows={myDocuments}
                columns={myDocumentsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: MyDocumentsFilters,}}
           
                onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
                }}
                selectionModel={selectionModel}
 
            />
            <Button variant = "contained" onClick={()=>handleDialog(selectionModel)}>
                  Share Document
            </Button>

        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
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
                <TextField onChange={handleDocLink} />
                <Button variant = "contained" onClick={onFileUpload}>
                  Upload!
                </Button> 
                <Button variant = "contained" onClick={() => handleDeleteRecord(selectionModel[0])}>
                  Delete!
                </Button>
            </div>

            {
        showDialog?(
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
              <DialogContentText>
               Enter Email ID of the receiver:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Emai ID"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={()=>{ShareMyDocument(selectionModel[0], email);handleClose()}}>Share</Button>
            </DialogActions>
          </Dialog>
        </div>):""}
        </div>
    )

}


export default MyDocuments;