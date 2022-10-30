import React, { useState} from "react";
import {TextField} from "@mui/material";
import { Select,FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import '../App.css';

function PharmacyView(){
    const [options, setOptions] = useState(0);

    const handleLogOut = () => {
    };

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [comment, setComment] = useState("")
    const [pendingOrders, setPendingOrders] = useState([]);
    const [availableMedicines, setAvailableMedicines] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [reports, setReports] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [addNewMedicineDialog, setAddNewMedicineDialog] = useState(false);
    const [showDialogEditMedicine, setShowDialogEditMedicine] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [openNewMedicine, setOpenNewMedicine] = React.useState(false);
    const [openEditMedicine, setOpenEditMedicine] = useState(false);
    const [newMedicineID, setNewMedicineID] = useState("");
    const [newMedicineName, setNewMedicineName] = useState("")
    const [newMedicinePrice, setNewMedicinePrice] = useState("")
    const [editMedicineName, setEditMedicineName] = useState("")
    const [editMedicinePrice, setEditMedicinePrice] = useState("")

    const order_columns = [
        { field: 'Patient_ID', headerName: 'Patient ID', width: 130 },
        { field: 'Medicine_ID', headerName: 'Medicine ID', width:130 },
        { field: 'Prescription_ID', headerName: 'Prescription ID', width:130 },
        { field: 'Prescription', headerName: 'Prescription', width:130 },
        { field: 'date', headerName: 'Date of Issuance', width:130 },
      ];
      const available_medicines_columns = [
        { field: 'Medicine_ID', headerName: 'Medicine ID', width: 130},
        { field: 'Medicine_Name', headerName: 'Medicine Name', width:130},
        { field: 'Medicine_Cost', headerName: 'Medicine Cost', width:130},
      ];
      React.useEffect(()=>{
        if(options == 1)
        {
            const fetchAvailableMedicines = () => 
            {
                console.log("fetching available medicines: ", options)
                setAvailableMedicines([
                    {
                        'Medicine_ID':"1e34",
                        'Medicine_Name':"Paracip",
                        'Medicine_Cost':"30",
                    },
                    {
                        'Medicine_ID':"2g5",
                        'Medicine_Name':"Mox",
                        'Medicine_Cost':"45",
                    },
                ])
            }
            fetchAvailableMedicines();
        }
        if(options==2)
        {
            console.log("got inside loop: ", options)
            const fetchReport = () => {
                console.log("got inside fetch reports: ", options)
                setPendingOrders([
                        {
                            'Patient_ID':"102",
                            'Medicine_ID':"220",
                            'Prescription_ID':"140",
                            'Prescription':"2 doses each",
                            'date': "2022/02/20",
                        },
                        {
                            'Patient_ID':"104",
                            'Medicine_ID':"222",
                            'Prescription_ID':"141",
                            'Prescription':"100ml everyday",
                            'date': "2022/02/25",
                        },
                    ])
            }
            fetchReport();
        }
        if(options == 3)
        {
            const fetchAllRecords = () => {
                setAllOrders([
                    {
                        'Patient_ID':"119",
                        'Medicine_ID':"224",
                        'Prescription_ID':"140",
                        'Prescription':"2 doses each",
                        'date': "2022/02/20",
                    },
                    {
                        'Patient_ID':"104",
                        'Medicine_ID':"222",
                        'Prescription_ID':"141",
                        'Prescription':"100ml everyday",
                        'date': "2022/02/25",
                    },
                ])
            }
            fetchAllRecords()
        }

    }, [options])
    const handleDialog=(reports_to_resolve)=>{
        console.log(reports_to_resolve)
        if(reports_to_resolve.length==0) return;
        setShowDialog(true);
        handleClickOpen();
    }
    const handleDialogEditMedicine = (medicine_to_edit) =>{
        if(medicine_to_edit.length == 0) return;
        if(medicine_to_edit.length > 1) {
            alert("Select only 1 medicine to edit!");
            return;
        }
        setShowDialogEditMedicine(true)
        handleClickOpenEditMedicine()
    }
    const handleAddNewMedicines = () => {
        setAddNewMedicineDialog(true)
        handleClickOpenNewMedicine();
    }

    const resolvePendingOrders = (reports) => {
        console.log("Resolving Working..", comment, reports)
        // setPendingOrders()
    }
    const addNewMedicine = () => 
    {
        console.log("Adding New Medicine: ", newMedicineID, newMedicineName, newMedicinePrice)
    }
    const editMedicineDetails = (medicine_to_edit) => {
        console.log(medicine_to_edit)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }
    const handleClickOpenNewMedicine = () => {
        setOpenNewMedicine(true);
    };
    const handleCloseNewMedicine = () => {
        setOpenNewMedicine(false);
    }
    const handleClickOpenEditMedicine = () => {
        setOpenEditMedicine(true);
    };
    const handleCloseEditMedicine = () => {
        setOpenEditMedicine(false);
    }

    function allPendingOrdersTableOptions() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All_Pending_Orders',
              }}/>
          </GridToolbarContainer>
        );
      }

    function allOrdersTableOptions() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'All_Orders',
              }}/>
          </GridToolbarContainer>
        );
      }

    return(
        <div>
            <div className="User-View">
                <div className="LayersUser">
                    <Button className="button is-primary User-View-Button" onClick={() => {setOptions(1); console.log(1)}} >Manage Available Medicines</Button>
                    <Button className="button is-primary User-View-Button" onClick={() => {setOptions(2); console.log(2)}}>View Pending Requests</Button>
                    <Button className="button is-primary User-View-Button" onClick={() => {setOptions(3); console.log(3)}} >View All Past Orders</Button>
                    <Button className="button is-primary User-View-Button" onClick={() => {setOptions(4); console.log(4)}}>Personal Info</Button>
                    <Button className="button is-primary User-View-Button" onClick={handleLogOut}>
                        LogOut
                    </Button> 
                </div>
            </div>
            {options == 1? <div id="User-View">
                <div>
                    <DataGrid 
                    rows={availableMedicines}
                    columns={available_medicines_columns}
                    pageSize={10}
                    getRowId={(row: any) =>  row.Medicine_ID}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    autoHeight
                    onSelectionModelChange={(newSelection) => {
                    setSelectionModel(newSelection);
                    }}
                    selectionModel={selectionModel}
                    />
                    <Button variant="contained"  onClick={()=>{
                        handleAddNewMedicines();
                        }} component="span" className = "Upload" >
                        Add Medicine
                    </Button> 
                    <Button variant="contained"  onClick={()=>{
                        handleDialog(selectionModel);
                        }} component="span" className = "Upload" >
                        Delete
                    </Button> 
                    <Button variant="contained"  onClick={()=>{
                        handleDialogEditMedicine(selectionModel);
                        }} component="span" className = "Upload" >
                        Edit Medicine Info
                    </Button> 
                </div>
            </div>   :""}
            {options == 2?
            (
            <div id="User-View">
                <div>
                    <DataGrid 
                    rows={pendingOrders}
                    columns={order_columns}
                    pageSize={10}
                    getRowId={(row: any) =>  row.Patient_ID + ":"+ row.Prescription_ID +":"+row.Medicine_ID}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    autoHeight
                    onSelectionModelChange={(newSelection) => {
                    setSelectionModel(newSelection);
                    }}
                    components={{Toolbar: allPendingOrdersTableOptions,}}
                    selectionModel={selectionModel}
                    />
                    <Button variant="contained"  onClick={()=>{
                        handleDialog(selectionModel);
                        }}component="span" className = "Upload" >
                        Upload
                    </Button>
                </div>
            </div>   
            )
            :""}
        {options == 3?
        <div className = "Healthcare-Professional-RightWrapper">
            <div className="ReportsTable">
                <DataGrid 
                    rows={allOrders}
                    columns={order_columns}
                    pageSize={10}
                    getRowId={(row: any) =>  row.Patient_ID + ":"+ row.Prescription_ID +":"+row.Medicine_ID}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    autoHeight
                    onSelectionModelChange={(newSelection) => {
                    setSelectionModel(newSelection);
                    }}
                    components={{Toolbar: allOrdersTableOptions,}}
                    selectionModel={selectionModel}
                />
            </div>
        </div>   
        :""}
        {options == 4?
        <div></div>
        :""}
        {
        showDialog?(
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogContent>
              <DialogContentText>
               Following Medicines will be deleted: {selectionModel.map(val=><p>{val.split(" ")[0]}</p>)}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Comments"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e)=>setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={()=>{resolvePendingOrders(String(selectionModel));handleClose()}}>Resolve</Button>
            </DialogActions>
          </Dialog>
        </div>):""}
        {addNewMedicineDialog?
        (
            <div>
              <Dialog open={openNewMedicine} onClose={handleCloseNewMedicine}>
                <DialogTitle>Add new Medicine</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                   Enter the new Medicine Details: 
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Medicine ID"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setNewMedicineID(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Medicine Name"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setNewMedicineName(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Price"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setNewMedicinePrice(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseNewMedicine}>Cancel</Button>
                  <Button onClick={()=>{addNewMedicine();handleCloseNewMedicine()}}>Add Medicine</Button>
                </DialogActions>
              </Dialog>
            </div>)
        :""}
        {showDialogEditMedicine?
            (<div>
                <Dialog open={openEditMedicine} onClose={handleCloseEditMedicine}>
                  <DialogTitle>Edit</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                     Enter the edit Medicine Details for MedicineID: {String(selectionModel)}: 
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Medicine ID"
                      type="email"
                      fullWidth
                      value = {String(selectionModel)}
                      variant="standard"
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Medicine Name"
                      type="email"
                      fullWidth
                      variant="standard"
                      onChange={(e)=>setEditMedicineName(e.target.value)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Price"
                      type="email"
                      fullWidth
                      variant="standard"
                      onChange={(e)=>setEditMedicinePrice(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEditMedicine}>Cancel</Button>
                    <Button onClick={()=>{editMedicineDetails(selectionModel);handleCloseEditMedicine()}}>Edit Medicine</Button>
                  </DialogActions>
                </Dialog>
              </div>)
        :""}
     </div>
    )
}
export default PharmacyView;