import React, {useState, useEffect} from 'react';
import env from "react-dotenv";
import axios from "axios";
import { getToken } from '../services/localStorageService';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";


function HealthcareProfessionalsList(){

    const [healthcareProfessionals, setHealthcareProfessionals] = useState([]);
    let {access_token, refresh_token} = getToken()

      const FetchHealthcareProfessionals = ()=>{

        //make axios call here
        axios({
            method: "GET",
            url:`${process.env.REACT_APP_BACKEND}/get_all_healthcare_professionals`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setHealthcareProfessionals(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              }
          })
       

    };
    useEffect(()=>{

        
        FetchHealthcareProfessionals();

    },[]);


    function HealthcareProfessionalsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All Healthcare Professionals',
              }}/>
          </GridToolbarContainer>
        );
      }

    const healthcareProfessionalColumns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact', headerName: 'Contact Details', width:300 },
      ];
      




    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Healthcare professionals list
            <DataGrid 
                rows={healthcareProfessionals}
                columns={healthcareProfessionalColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: HealthcareProfessionalsFilters,}}
            />

        </div>
    )

}

export default HealthcareProfessionalsList;