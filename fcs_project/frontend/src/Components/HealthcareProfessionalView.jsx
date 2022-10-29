import React, { useState, useContext } from "react";
import Button from '@mui/material/Button';
import '../App.css';

function HealthcareProfessionalView(){
    const [options, setOptions] = useState(0);
    const handleLogOut = () => {
    };

    const [pendingReports, setPendingReports] = useState(null);
    const [reports, setReports] = useState(null);

    const columns = [
        { field: 'P_Name', headerName: 'Patient Name', width: 130 },
        { field: 'date', headerName: 'Date of Issuance', width:130 },
        { field: 'Doc_Type', headerName: 'Time', width:130 },
      ];

    return(
        <div id='User-App-Body'>
            <div className="User-View">
                <div className="LayersUser">
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(1); console.log(1)}} >View Pending Document Request</Button>
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(2);console.log(2)}}>Upload Documents</Button>
                <Button className="button is-primary User-View-Button" onClick={handleLogOut}>
                    LogOut
                </Button> 
                </div>
            </div>
            {options == 1?
            (<div className = "Healthcare-Professional-RightWrapper">
            <div className="ReportsTable">
                <DataGrid 
                rows={pendingReports}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
                }}
                selectionModel={selectionModel}
                
                components={
                    {
                        Toolbar: reportedLightsTableOptions, 
                    }
                }
                />
                <Button variant="contained"  onClick={()=>{
                    handleDialog(selectionModel);
                    }}component="span" className = "Upload" >
                    Upload
                </Button>
                </div>
            </div>   
            )
            :
            ""
            }
            {options == 2?
            (<div className = "Healthcare-Professional-RightWrapper">
            <div className="ReportsTable">
                <DataGrid 
                rows={reports}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
                }}
                selectionModel={selectionModel}
                
                components={
                    {
                        Toolbar: reportedLightsTableOptions, 
                    }
                }
                />
                <Button variant="contained"  onClick={()=>{
                    handleDialog(selectionModel);
                    }}component="span" className = "Upload" >
                    Upload
                </Button>
                </div>
            </div>   
            )
            :
            ""}
        </div>
    )
}
export default HealthcareProfessionalView;