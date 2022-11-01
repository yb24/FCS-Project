import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";



function SharedDocuments(){


    const [sharedDocuments, setSharedDocuments] = useState([])

    const FetchSharedDocuments  =()=>{

        setSharedDocuments([
            {'type':'Prescription', 'doc':'xxyyzz', 'shared_by':'harman.iiit@gmail.com', 'report_id':101},
            {'type': 'Discharge Summary', 'doc':'lolol', 'shared_by':'harman.iiit@gmail.com', 'report_id':201}
        ])
    }

    useEffect(()=>{

        FetchSharedDocuments()
        
    }, [sharedDocuments])


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
                getRowId={row =>  row.report_id}
                components={{Toolbar: SharedDocumentsFilters,}}
            />
         

        </div>

        </div>
    )

}


export default SharedDocuments;