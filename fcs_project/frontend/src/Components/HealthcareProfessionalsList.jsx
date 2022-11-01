import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";


function HealthcareProfessionalsList(){

    const [healthcareProfessionals, setHealthcareProfessionals] = useState([
        {'name': 'Dr. Rajesh Sachdev', 'email_id': 'rsach@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in paediatrics', 'contact_details':'9868919191', 'user_id':100},
        {'name': 'Dr. Bobby Bhalotra', 'email_id': 'bbhalotra@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in respiratory diseases', 'contact_details':'9868419191', 'user_id':101},
        {'name': 'Dr. Ajay Mehta', 'email_id': 'amehta@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in cardiology', 'contact_details':'9868919192', 'user_id':102}
      ]);

    useEffect(()=>{

        const FetchHealthcareProfessionals = ()=>{

            //make axios call here
            setHealthcareProfessionals([
                {'name': 'Dr. Rajh Sachdev', 'email_id': 'rsach@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in paediatrics', 'contact_details':'9868919191', 'user_id':100},
                {'name': 'Dr. Bobby Bhalotra', 'email_id': 'bbhalotra@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in respiratory diseases', 'contact_details':'9868419191', 'user_id':101},
                {'name': 'Dr. Ajay Mehta', 'email_id': 'amehta@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'Specialization in cardiology', 'contact_details':'9868919192', 'user_id':102}
            ]);

        }

        FetchHealthcareProfessionals();

    },[])


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
        { field: 'email_id', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact_details', headerName: 'Contact Details', width:300 },
      ];
      



    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Healthcare professionals list
            <DataGrid 
                rows={healthcareProfessionals}
                columns={healthcareProfessionalColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.user_id}
                components={{Toolbar: HealthcareProfessionalsFilters,}}
            />

        </div>
    )

}

export default HealthcareProfessionalsList;