import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';

function SharedDocuments(){
    const [sharedDocuments, setSharedDocuments] = useState([])
    let {access_token, refresh_token} = getToken()
    let userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 
    const FetchSharedDocuments  =()=>{

        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/display_shared_documents`,
            data:{
                token: access_token,
                userID:userID,
            }
          }).then((response)=>{
            console.log(response)
            setSharedDocuments(response.data)

          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
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
            />
         

        </div>

        </div>
    )

}


export default SharedDocuments;