import React, {useState, useEffect} from 'react';
import env from "react-dotenv";
import axios from "axios";
import { getToken } from '../services/localStorageService';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import {useNavigate} from 'react-router-dom';

function HealthcareProfessionalsList(){

    const [healthcareProfessionals, setHealthcareProfessionals] = useState([]);
    let {access_token} = getToken()
    //role based access control
    const navigate = useNavigate();
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
            ////console.log("role is",response.data.role)
            role = response.data.role
            if (!(role=="PT" || role=="AD") || response.data.userStatus!="AU")
            {
                navigate("../../")
            }
        }).catch((error) => {
          navigate("../../")
        })
    }, []);

      const FetchHealthcareProfessionals = ()=>{
        //make axios call here
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/get_all_healthcare_professionals`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            setHealthcareProfessionals(data)
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response.data)
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
        { field: 'name', headerName: 'Name', width: 600 },
        { field: 'email', headerName: 'Email ID', width:600 },
        { field: 'location', headerName: 'Location', width:600 },
        { field: 'description', headerName: 'Description', width:600 },
        { field: 'contact', headerName: 'Contact Details', width:600 },
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