import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import axios from 'axios';
import { getToken } from '../services/localStorageService';

function InsuranceFirmsList(){

    const [insuranceFirms, setInsuranceFirms] = useState([]);
    let {access_token, refresh_token} = getToken()

    const FetchInsuranceFirms = ()=>{

        //make axios call here
        axios({
            method: "GET",
            url:`${process.env.REACT_APP_BACKEND}/get_all_insurance_firm`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setInsuranceFirms(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              }
          })
       

    };
    useEffect(()=>{

        
        FetchInsuranceFirms();

    },[]);

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
        { field: 'email', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact', headerName: 'Contact Details', width:300 },
      ];
     

    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Insurance Firms list
            <DataGrid 
                rows={insuranceFirms}
                columns={insurance_firms_columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: insuranceFirmsFilters,}}
            />

        </div>
    )

}

export default InsuranceFirmsList;