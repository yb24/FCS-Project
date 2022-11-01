import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";


function HospitalsList(){


    const [hospitals, setHospitals] = useState([
        {'name': 'Sir Gangna Ram Hospital', 'email_id': 'sgrh@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868919191', 'user_id':200},
        {'name': 'BLK', 'email_id': 'blk@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868419191', 'user_id':201},
        {'name': 'RML', 'email_id': 'rml@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868919192', 'user_id':202}
    ]);

    useEffect(()=>{

        const FetchHospitals = ()=>{

            //make axios call here
            setHospitals([
                {'name': 'Sir Ganga Ram Hospital', 'email_id': 'sgrh@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868919191', 'user_id':200},
                {'name': 'BLK', 'email_id': 'blk@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868419191', 'user_id':201},
                {'name': 'RML', 'email_id': 'rml@gmail.com', 'location':'Rajinder Nagaer, New Delhi', 'description':'World class healthcare facilities', 'contact_details':'9868919192', 'user_id':202}
            ]);

        }

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
        { field: 'email_id', headerName: 'Email ID', width:300 },
        { field: 'location', headerName: 'Location', width:300 },
        { field: 'description', headerName: 'Description', width:300 },
        { field: 'contact_details', headerName: 'Contact Details', width:300 },
      ];




    return(
        
        <div style={{ height: 300, width: '100%' }} >
         Hospitals list
            <DataGrid 
                rows={hospitals}
                columns={hospitalsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.user_id}
                components={{Toolbar: HospitalsFilters,}}
            />

        </div>
    )

}

export default HospitalsList;