import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import axios from 'axios';
import { getToken } from '../services/localStorageService';
import {useNavigate} from 'react-router-dom';

function HospitalsList(){


    const [hospitals, setHospitals] = useState([]);
    let {access_token} = getToken()
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

    const FetchHospitals = ()=>{

        //make axios call here
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/get_all_hospital`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            //console.log(data)
            setHospitals(data)
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response.data);
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
        { field: 'name', headerName: 'Name', width: 600 },
        { field: 'email', headerName: 'Email ID', width:600 },
        { field: 'location', headerName: 'Location', width:600 },
        { field: 'description', headerName: 'Description', width:600 },
        { field: 'contact', headerName: 'Contact Details', width:600 },
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