import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";


function InsuranceFirmsList(){

    function insuranceFirmsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All Insurance Firms',
              }}/>
          </GridToolbarContainer>
        );
      }

    const insurance_firms_columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email_id', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact_details', headerName: 'Contact Details', width:300 },
      ];
      const insurance_firms = [
        {'name': 'LIC', 'email_id': 'lic@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Trustworthy', 'contact_details':'9868919191', 'user_id':300},
        {'name': 'MCC', 'email_id': 'mcc@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Trustworthy', 'contact_details':'9868419191', 'user_id':301},
        {'name': 'DBC', 'email_id': 'dbc@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Trustworthy', 'contact_details':'9868919192', 'user_id':302}
      ];



    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Insurance Firms list
            <DataGrid 
                rows={insurance_firms}
                columns={insurance_firms_columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.user_id}
                components={{Toolbar: insuranceFirmsFilters,}}
            />

        </div>
    )

}

export default InsuranceFirmsList;