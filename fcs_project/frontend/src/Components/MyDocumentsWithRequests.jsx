import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, InputLabel, MenuItem, FormControl, Select, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';
import {useNavigate} from 'react-router-dom';

function MyDocumentsWithRequests(){


    const [myDocuments, setMyDocuments] = useState([])
    const [documentRequests, setDocumentRequests] = useState([])

    const [selectedFile, setSelectedFile] = useState(null);
    const [type, setType] = useState('');

    let {access_token} = getToken()


     //role based access control
     const navigate = useNavigate()
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
             //console.log("role is",response.data.role)
             role = response.data.role
             if (response.data.userStatus!="AU")
             {
                 navigate("../../")
             }
        
             else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/HospitalView/MyDocuments'.toLowerCase() && !(role=="HS" || role=="AD"))
             {
               navigate("../../")
             }
             else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/HealthcareProfessionalView/MyDocuments'.toLowerCase() && !(role=="HP" || role=="AD"))
             {
               navigate("../../")
             }
            
         }).catch((error) => {
             navigate("../../")
         })
     }, []); 
    
    //For document
    const [selectionModel, setSelectionModel] = useState([]);
    const [selectionModelRequest, setSelectionModelRequest] = useState([])
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('')

    const [responseMessage, setResponseMessage] = useState('');

    const FetchMyDocuments =()=>{
      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/display_upload_records`,
        data:{
            token: access_token,
        }
      }).then((response)=>{
        const data = response.data
        //console.log(data)
        setMyDocuments(data)
      }).catch((error) => {
        if (error.response) {
          //console.log(error.response);

          }
      })
    }

    const FetchDocumentRequests =()=>{
        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/display_pending_document_requests`,
          data:{
              token: access_token,
          }
        }).then((response)=>{
          const data = response.data
          setDocumentRequests(data)
        }).catch((error) => {
          if (error.response) {
            //console.log(error.response.data);
            setResponseMessage(error.response.data)
            }
        })
      }

    useEffect(()=>{
        FetchMyDocuments()
    }, [])

    useEffect(()=>{
        FetchDocumentRequests()
    }, [])

    const handleDeleteRecord = (report_id) => {
      if(!report_id)
        return;
      axios({
        method: "DELETE",
        url:`${process.env.REACT_APP_BACKEND}/delete_upload_records`,
        data:{
            token: access_token,
            reportID: report_id,
        }
      }).then((response)=>{
        //console.log(response)
        setResponseMessage("File deleted successfully!")
        FetchMyDocuments()
      }).catch((error) => {
        if (error.response) {
          //console.log(error.response);
          setResponseMessage("File could not be deleted due to some error.")
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

      if(!selectedFile) return;

      let formData = new FormData();
      formData.append('token', access_token);
      formData.append('docType', type);
      formData.append('image', selectedFile, selectedFile.name);
      formData.append('title', selectedFile.name);
      formData.append('content', "File");
      let url = `${process.env.REACT_APP_BACKEND}/insert_upload_records`;
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response)=>{
        const data = response.data
        //console.log(data)
        setResponseMessage("File uploaded successfully!")
        FetchMyDocuments()
      }).catch((error) => {
        if (error.response) {
          //console.log(error.response);
          setResponseMessage("Error occurred due to unsupported file type, size limit, or unauthorized access.")
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
        //console.log(report)
        if(report.length==0) return;
        setShowDialog(true);
        handleClickOpen();
     }

     const ShareMyDocument=(reportID, emailID, requestID)=>{

      if(!reportID || !emailID) return;
      //make axios call here

      axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/share_document`,
          data:{
              token: access_token,
              reportID: reportID,
              emailID : emailID,
              requestID: requestID
          }

        }).then((response)=>{
          //console.log(response)
          setResponseMessage("File shared successfully!")
          FetchDocumentRequests();
        }).catch((error) => {
          if (error.response) {
            //console.log(error.response);
            setResponseMessage("File could not be shared due to some error.")
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
      const documentRequestColumns = [
        {field: 'name', headerName: "Name", width:300},
        { field: 'email', headerName: 'Email ID', width: 300 },
        { field: 'type', headerName: 'Type of Document', width:300 },
        { field: 'date', headerName: 'Date', width:300 },
      ];





      const handleViewDocument = (selectedRowID) =>{

        if(selectedRowID.length===0) return;
        let filePath = '';
        for(let i=0; i<myDocuments.length; i++){
          if(myDocuments[i]['id']===selectedRowID[0]){
            filePath = myDocuments[i]['docLink']
            break;
          }
        }
        axios({
          method: "POST",
          url:`${process.env.REACT_APP_BACKEND}/get_file`,
          data:{
              token: access_token,
              file:filePath
          },
          responseType:'blob',
        }).then((response)=>{
        
          
          window.open((URL.createObjectURL(response.data)), '_blank')
      
        }).catch((error) => {
          if (error.response) {
            //console.log(error.response.data);
           
          }
        
  
        })
        


      }



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
                {/* <TextField onChange={handleDocLink} /> */}
                <input type="file" onChange={onFileChange} />
                <Button variant = "contained" onClick={onFileUpload}>
                  Upload!
                </Button> 
                <Button variant = "contained" onClick={() => handleDeleteRecord(selectionModel[0])}>
                  Delete!
                </Button>
                <Button variant = "contained" onClick={() => handleViewDocument(selectionModel)}>
                  View Document
                </Button>
            </div>
    
            <br></br>
            <br></br>
           <div style={{ height: 300, width: '100%' }} >
         Request List
            <DataGrid 
                rows={documentRequests}
                columns={documentRequestColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: MyDocumentsFilters,}}
           
                onSelectionModelChange={(newSelection) => {
                setSelectionModelRequest(newSelection);
                }}
                selectionModel={selectionModelRequest}
 
            />
            <Button variant = "contained" onClick={()=>handleDialog(selectionModel)}>
                  Share Document
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
              <Button onClick={()=>{ShareMyDocument(selectionModel[0], email, selectionModelRequest[0]?selectionModelRequest[0]:"");handleClose()}}>Share</Button>
            </DialogActions>
          </Dialog>
        </div>):""}
        </div>
    )

}


export default MyDocumentsWithRequests;