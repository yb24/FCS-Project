import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import axios from 'axios';
import { getToken } from '../services/localStorageService';

function HospitalsList(){


    const [hospitals, setHospitals] = useState([]);
    let {access_token, refresh_token} = getToken()


    const FetchHospitals = ()=>{

        //make axios call here
        axios({
            method: "GET",
            url:`${process.env.REACT_APP_BACKEND}/get_all_hospital`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setHospitals(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              }
          })
       

    };
    useEffect(()=>{

        
        FetchHospitals();

    },[]);

    function HospitalsFilters() {
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

    const hospitalsColumns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact', headerName: 'Contact Details', width:300 },
      ];




    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Hospitals list
            <DataGrid 
                rows={hospitals}
                columns={hospitalsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: HospitalsFilters,}}
            />

        </div>
    )

}

export default HospitalsList;