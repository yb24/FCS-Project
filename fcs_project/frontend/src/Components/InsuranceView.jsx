import React, { useState} from "react";
import {TextField} from "@mui/material";
import { Select,FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid} from "@mui/x-data-grid";
import '../App.css';

function InsuranceView(){
    const [options, setOptions] = useState(0);
    const [patientName, setPatientName] = useState("")
    const [aadhar, setAadhar] = useState("")
    const [issuerName, setIssuerName] = useState("")
    const [date, setDate] = useState("2022-05-24")
    const [validity, setValidity] = useState(0)
    const [additionalInfo, setAdditionalInfo] = useState("")
    const [amount, setAmount] = useState(0)

    const handlePatientName = (event) =>{
        console.log(event.target.value)
        setPatientName(event.target.value)
    }
    const handleAadhar = (event) =>{
        console.log(event.target.value)
        setAadhar(event.target.value)
    }
    const handleIssuerName = (event) =>{
        console.log(event.target.value)
        setIssuerName(event.target.value)
    }
    const handleIssuanceDate= (event) =>{
        console.log(event.target.value)
        setDate(event.target.value)
    }
    const handleValidity = (event) =>{
        console.log(event.target.value)
        setValidity(event.target.value)
    }

    const handleAdditionalInfo = (event) => {
        console.log(event.target.value)
        setAdditionalInfo(event.target.value)
    }
    const handleAmount = (event) => {
        console.log(event.target.value)
        setAmount(event.target.value)
    }
    

    const handleLogOut = () => {
    };

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [pendingClaims, setPendingClaims] = useState([]);
    const [allInsuranceData, setAllInsuranceData] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = React.useState(false);

    const claim_columns = [
        { field: 'Patient_ID', headerName: 'Patient ID', width: 130 },
        { field: 'Discharge_Summary', headerName: 'Discharge Summary', width:130 },
        { field: 'Bill', headerName: 'Bill', width:130 },
        { field: 'date', headerName: 'Date of Issuance', width:130 },
      ];
      React.useEffect(()=>{
        if(options==2)
        {
            console.log("got inside loop: ", options)
            const fetchInsuranceData = () => {
                console.log("got inside fetch pending claims: ", options)
                setPendingClaims([
                        {
                            'Patient_ID':"1xx45",
                            'Discharge_Summary': 'Dishcarge on 10th',
                            'Bill':10000,
                            'date': "2022/05/20",
                        },
                        {
                            'Patient_ID':"25",
                            'Discharge_Summary': 'Dishcarge on 10th',
                            'Bill':25000,
                            'date': "2022/06/15",
                        },
                    ])
            }
            fetchInsuranceData();
        }
        if(options == 3)
        {
            const fetchAllInsuranceData = () => {
                console.log("got inside fetch all policy data: ", options)
                setAllInsuranceData([
                        {
                            'Patient_ID':"15",
                            'Discharge_Summary': 'Dishcarge on 10th',
                            'Bill':10000,
                            'date': "2022/05/20",
                        },
                        {
                            'Patient_ID':"25",
                            'Discharge_Summary': 'Dishcarge on 10th',
                            'Bill':25000,
                            'date': "2022/06/15",
                        },
                    ])
            }
            fetchAllInsuranceData();
        }

    }, [options])
    const handleDialog=(reports_to_resolve)=>{
        console.log(reports_to_resolve)
        if(reports_to_resolve.length==0) return;
        setShowDialog(true);
        handleClickOpen();
    }


    const resolvePendingClaims = (reports) => {
        console.log("Resolving Claims..", reports)
        // setPendingClaims()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }
    const uploadForm = (event) =>{
        console.log("Form uploaded")
    }
    return(
        <div>
            <div className="User-View">
                <div className="LayersUser">
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(1); console.log(1)}}>Upload Insurance Document</Button>
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(2); console.log(2)}} >View Pending Claim Request</Button>
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(3); console.log(3)}}>Customer Data and Policies</Button>
                <Button className="button is-primary User-View-Button" onClick={handleLogOut}>
                    LogOut
                </Button> 
                </div>
            </div>
            {options == "1"?
                    <div className="form">
                    <form>
                        <label>
                            Patient Name:
                            <input type="text" value={patientName} onChange={handlePatientName} />
                            </label>
                        <br/><br/>
                        <label>
                            Aadhar Card:
                            <input type="text" value={aadhar} onChange={handleAadhar} />
                            </label>
                        <br/><br/>
                        <label>
                            Issuer Name: 
                            <input type="text" value={issuerName} onChange={handleIssuerName} />
                        </label>
                        <br/><br/>
                        <TextField
                            id="date"
                            label="Issuance Date"
                            type="date"
                            value={date}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleIssuanceDate}
                        />
                        <br/><br/>
                        <label>
                            Validity (in months): 
                            <input type="text" value={validity} onChange={handleValidity} />
                        </label>
                        <br/><br/>
                        <label>
                            Amount: 
                            <input type="text" value={amount} onChange={handleAmount} />
                        </label>
                        <br/><br/>
                        <label>
                        Additional Information
                        <TextField
                            type="text"
                            value={additionalInfo}
                            onChange={handleAdditionalInfo}
                        />
                        </label>
                        <br/><br/>
                        <button variant="contained" style={{maxWidth: '100px', maxHeight: '100px', minWidth: '30px', minHeight: '30px'}} type="button" onClick={uploadForm}>Submit</button>
                    </form>
                    </div>
                :""}
                {options == 2?
                    <div className = "Healthcare-Professional-RightWrapper">
                    <div className="ReportsTable">
                        <DataGrid 
                            rows={pendingClaims}
                            columns={claim_columns}
                            pageSize={10}
                            getRowId={(row: any) =>  row.Patient_ID + ":"+ row.date}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            autoHeight
                            onSelectionModelChange={(newSelection) => {
                            setSelectionModel(newSelection);
                            }}
                            selectionModel={selectionModel}
                        />
                        <Button variant="contained"  onClick={()=>{
                        handleDialog(selectionModel);
                        }}component="span" className = "Upload">
                            Upload
                        </Button>
                    </div>
                    </div>   
                :""}
                {options == 3?
                    <div className = "Healthcare-Professional-RightWrapper">
                    <div className="ReportsTable">
                        <DataGrid 
                            rows={allInsuranceData}
                            columns={claim_columns}
                            pageSize={10}
                            getRowId={(row: any) =>  row.Patient_ID + ":"+ row.date}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            autoHeight
                            onSelectionModelChange={(newSelection) => {
                            setSelectionModel(newSelection);
                            }}
                            selectionModel={selectionModel}
                        />
                        <Button variant="contained"  onClick={()=>{
                        handleDialog(selectionModel);
                        }}component="span" className = "Upload">
                            Upload
                        </Button>
                    </div>
                    </div>
                :""}
            {
            showDialog?(
            <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Resolve Pending Claims</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Following Claims are being considerd:  {selectionModel.map(val=><p>{val.split(" ")[0]}</p>)}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={()=>{resolvePendingClaims(String(selectionModel));handleClose()}}>Resolve</Button>
                </DialogActions>
            </Dialog>
            </div>):""}
        </div>
    )
}
export default InsuranceView;   