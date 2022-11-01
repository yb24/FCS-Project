import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";


function PharmaciesList(){

    function pharmaciesFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All Pharmacies',
              }}/>
          </GridToolbarContainer>
        );
      }

    const pharmacies_columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email_id', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact_details', headerName: 'Contact Details', width:300 },
      ];
      const pharmacies = [
        {'name': 'New medicos', 'email_id': 'newmedicos@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'10% discount', 'contact_details':'9868919191', 'user_id':400},
        {'name': '24/7 medicines', 'email_id': 'tsmedicine@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'10% discount', 'contact_details':'9868419191', 'user_id':401},
        {'name': 'Pharmpeasy', 'email_id': 'pharmpeasy@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'10% discounts', 'contact_details':'9868919192', 'user_id':402}
      ];



    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Pharmacies list
            <DataGrid 
                rows={pharmacies}
                columns={pharmacies_columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.user_id}
                components={{Toolbar: pharmaciesFilters,}}
            />

        </div>
    )

}

export default PharmaciesList;