import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import axios from 'axios';
import { getToken } from '../services/localStorageService';

function PharmaciesList(){

    const [pharmacies, setPharmacies] = useState([]);
    let {access_token, refresh_token} = getToken()

    const FetchPharmacies = ()=>{

        //make axios call here
        axios({
            method: "GET",
            url:`${process.env.REACT_APP_BACKEND}/get_all_pharmacy`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setPharmacies(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              }
          })
       

    };
    useEffect(()=>{

        
        FetchPharmacies();

    },[]);

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
        { field: 'email', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact', headerName: 'Contact Details', width:300 },
      ];
      


    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Pharmacies list
            <DataGrid 
                rows={pharmacies}
                columns={pharmacies_columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: pharmaciesFilters,}}
            />

        </div>
    )

}

export default PharmaciesList;