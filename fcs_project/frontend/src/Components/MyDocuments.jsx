import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";



function MyDocuments(){


    const [myDocuments, setMyDocuments] = useState([])

    const [selectedFile, setSelectedFile] = useState(null);
    const [type, setType] = useState('');

    

    const [selectionModel, setSelectionModel] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('')

    const FetchMyDocuments  =()=>{

        setMyDocuments([
            {'type':'Prescription', 'doc':'xxyyzz', 'report_id':101},
            {'type': 'Discharge Summary', 'doc':'lolol', 'report_id':201}
        ])
    }

    useEffect(()=>{

        FetchMyDocuments()
        
    }, [myDocuments])


   



    

    const handleChangeType = (event) => {
        setType(event.target.value);
    };
   
    const onFileChange = (event)=>{

        setSelectedFile(event.target.files[0]);
    }

    const onFileUpload = () => {
    
        const formData = new FormData();
      
        formData.append(
          "myFile",
          selectedFile,
          selectedFile.name
        );
      
        console.log(selectedFile);
        console.log(formData);

        //axios.post("api/uploadfile", formData);
      };





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

     const ShareMyDocument=(report_id, email_id)=>{

        if(!report_id || !email_id) return;
        console.log(report_id, email_id)
     }


      function MyDocumentsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All Hospitals',
              }}/>
          </GridToolbarContainer>
        );
      }


      const myDocumentsColumns = [
        { field: 'type', headerName: 'Type of Document', width: 300 },
        { field: 'doc', headerName: 'Document', width:300 },
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
                getRowId={row =>  row.report_id}
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
                <input type="file" onChange={e=>onFileChange(e)} />
                <Button variant = "contained" onClick={onFileUpload}>
                  Upload!
                </Button>
                {selectedFile?URL.createObjectURL(selectedFile):""}
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