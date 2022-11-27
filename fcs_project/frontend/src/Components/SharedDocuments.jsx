import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import {Button} from '@mui/material';
import { getToken } from '../services/localStorageService';

function SharedDocuments(){
    const [sharedDocuments, setSharedDocuments] = useState([])
    let {access_token, refresh_token} = getToken()

    const [selectionModel, setSelectionModel] = useState([]);

    const FetchSharedDocuments  =()=>{

        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/display_shared_documents`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            setSharedDocuments(response.data)

          }).catch((error) => {
            if (error.response) {
              console.log(error.response.data);
              }
          })
        
    }

    useEffect(()=>{

        FetchSharedDocuments()
        
    }, [])


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
        { field: 'shared_by', headerName: 'Shared By', width:300 },
      ];




      const handleViewDocument = (selectedRowID) =>{

        if(selectedRowID.length===0) return;
        let filePath = '';
        for(let i=0; i<sharedDocuments.length; i++){
          if(sharedDocuments[i]['id']===selectedRowID[0]){
            filePath = sharedDocuments[i]['doc']
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
            console.log(error.response.data);
          }
        })
      }



    return(
        <div style={{margin:10, justifyContent:'center'}}>

           <div style={{ height: 300, width: '100%' }} >
         Shared Documents List
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
         

        </div>

        <Button variant = "contained" onClick={() => handleViewDocument(selectionModel)}>
                  View Document
                </Button>

        </div>
    )

}


export default SharedDocuments;