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
import axios from "axios"

function HealthcareProfessionalView(){
    const [options, setOptions] = useState(0);
    const [formChoice, setFormChoice] = useState("1");
    const [patientName, setPatientName] = useState("")
    const [issuerName, setIssuerName] = useState("")
    const [date, setDate] = useState("2022-05-24")
    const [medicines, setMedicines] = useState("")
    const [test, setTest] = useState("")
    const [additionalInfo, setAdditionalInfo] = useState("")
    const [amount, setAmount] = useState(0)
    const [admissionDays, setAdmissionDays] = useState(0)

    const handlePatientName = (event) =>{
        console.log(event.target.value)
        setPatientName(event.target.value)
    }
    const handleIssuerName = (event) =>{
        console.log(event.target.value)
        setIssuerName(event.target.value)
    }
    const handleDate= (event) =>{
        console.log(event.target.value)
        setDate(event.target.value)
    }
    const handleMedicines = (event) => {
        console.log(event.target.value)
        setMedicines(event.target.value)
    }
    const handleTestList = (event) => {
        console.log(event.target.value)
        setTest(event.target.value)
    }
    const handleAdmissionDays = (event) => {
        console.log(event.target.value)
        setAdmissionDays(event.target.value)
    }
    const handleAdditionalInfo = (event) => {
        console.log(event.target.value)
        setAdditionalInfo(event.target.value)
    }
    const handleAmount = (event) => {
        console.log(event.target.value)
        setAmount(event.target.value)
    }

    const formSelectionHandler = (event) => {
        console.log(event.target.value)
        setFormChoice(event.target.value);
    };

    const uploadForm = (event) =>{
        if(formChoice == 1)
            {
                // For inserting record...
                axios({
                    method: "POST",
                    url:`${process.env.REACT_APP_BACKEND}/insert_upload_records`,
                    data:{
                        token: 'abcdefgh',
                        userID: 'aryan19026@iiitd.ac.in',
                        docLink: 'Link',
                        docType: 'Prescription',
                    }
                  }).then((response)=>{
                    const data = response.data
                    console.log(data)
                  }).catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                      }
                  })
                console.log("Submit Form 1")
            }
        if(formChoice == 2)
            {
                axios({
                    method: "DELETE",
                    url:`${process.env.REACT_APP_BACKEND}/delete_upload_records`,
                    data:{
                        token: 'abcdefgh',
                        userID: 'aryan19026@iiitd.ac.in',
                    }
                  }).then((response)=>{
                    const data = response.data
                    console.log(data)
                  }).catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                      }
                  })
                console.log("Submit Form 2")
            }
        if(formChoice == 3)
            {
                axios({
                    method: "POST",
                    url:`${process.env.REACT_APP_BACKEND}/insert_user_table`,
                    data:{
                        email: "simmonscampos@wazzu.com",
                        name: "Becky Moore",
                        role: "HealthcareProfessional",
                        address: "120 Montague Terrace, Maxville, New Mexico, 1789",
                        contact: 749765635,
                        vAadhar: 9523670740863534,
                        healthLicence: "bf578a51-9bdd-46ff-8e5a-9328b388952f",
                        description: "Aliquip ad ad excepteur ut sunt adipisicing do reprehenderit reprehenderit elit eiusmod anim et eiusmod. Officia ea non tempor esse proident exercitation est velit sunt excepteur do enim. Nulla duis est elit sunt culpa velit quis est ipsum cupidatat ipsum pariatur. Dolore consequat qui anim est exercitation excepteur cillum adipisicing. Officia eu ut eu nulla id eu enim proident ullamco do labore commodo adipisicing. Enim est pariatur occaecat Lorem ex dolore amet pariatur irure proident.\r\n",
                        location: "103 Caton Avenue, Tedrow, Kentucky, 1023",
                        image1Path: "drive.google.com/53543534fdsfer324.png",
                        image2Path: "drive.google.com/4324tret533.jpg",
                        status: "NotAuthenticated"
                    }
                  }).then((response)=>{
                    const data = response.data
                    console.log(data)
                  }).catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                      }
                  })
                console.log("Submit Form 3")
            }
        if(formChoice == 4)
        {
            axios({
                method: "GET",
                url:`${process.env.REACT_APP_BACKEND}/get_all_healthcare_professionals`,
              }).then((response)=>{
                const data = response.data
                console.log(data)
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  }
              })
            console.log("Submit Form 4")
        }
    }

    const handleLogOut = () => {
    };

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [comment, setComment] = useState("")
    const [pendingReports, setPendingReports] = useState([]);
    const [reports, setReports] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [open, setOpen] = React.useState(false);

    const columns = [
        { field: 'P_Name', headerName: 'Patient Name', width: 130 },
        { field: 'date', headerName: 'Date of Issuance', width:130 },
        { field: 'Doc_Type', headerName: 'Document Requested', width:130 },
      ];
      React.useEffect(()=>{
        if(options==1)
        {
            console.log("got inside loop: ", options)
            const fetchReport = () => {

                axios({
                    method: "POST",
                    url:`${process.env.REACT_APP_BACKEND}/note`,
                    data:{
                        name: 'Content',
                        detail: 'this is a trap.'
                    }
                  }).then((response)=>{
                    const data = response.data
                    console.log(data)
                  }).catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                      }
                  })
                console.log("got inside fetch reports: ", options)
                setPendingReports([
                        {
                         'P_Name':"Aryan",
                         'date': "20/02/2022",
                         'Doc_Type': "Bill"
                        },
                        {
                            'P_Name':"harman",
                            'date': "20/10/2022",
                            'Doc_Type': "Presciption"
                        },
                    ])
            }
            fetchReport();
      }

    }, [options])
    const handleDialog=(reports_to_resolve)=>{
        console.log(reports_to_resolve)
        if(reports_to_resolve.length==0) return;
        setShowDialog(true);
        handleClickOpen();
    }

    const resolvePendingReports = (reports) => {
        console.log("Resolving Working..", comment, reports)
        // setPendingReports()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    return(
        <div>
            <div className="User-View">
                <div className="LayersUser">
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(1); console.log(1)}} >View Pending Document Request</Button>
                <Button className="button is-primary User-View-Button" onClick={() => {setOptions(2); console.log(2)}}>Upload Documents</Button>
                <Button className="button is-primary User-View-Button" onClick={handleLogOut}>
                    LogOut
                </Button> 
                </div>
            </div>
        {options == 1?
        (
        <div className = "Healthcare-Professional-RightWrapper">
            <div className="ReportsTable">
                <DataGrid 
                rows={pendingReports}
                columns={columns}
                pageSize={10}
                getRowId={(row: any) =>  row.P_Name + ":" + row.date}
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
                    }}component="span" className = "Upload" >
                    Upload
                </Button>
            </div>
        </div>   
        )
        :""}
        {options == 2?
        (
            <div>
                <div>
                    <FormControl style={{ marginTop: 100, marginLeft: 100 }}>
                        <InputLabel>Document Type</InputLabel>
                        <Select value={formChoice} defaultValue={"1"} onChange={formSelectionHandler}>
                            <option value="1">Prescription</option>
                            <option value="2">Test Results</option>
                            <option value="3">Discharge Summary</option>
                            <option value="4">Bills</option>
                        </Select>
                        <FormHelperText>Select document type</FormHelperText>
                    </FormControl>
                </div>
                <div>
                {formChoice == "1"?
                    <div className="form">
                    <form>
                        <label>
                            Patient Name:
                            <input type="text" value={patientName} onChange={handlePatientName} />
                            </label>
                        <br/><br/>
                        <label>
                            Issuer Name: 
                            <input type="text" value={issuerName} onChange={handleIssuerName} />
                        </label>
                        <br/><br/>
                        <TextField
                            id="date"
                            label="Choose Date"
                            type="date"
                            value={date}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleDate}
                        />
                        <br/><br/>
                        <label>
                        Medicine List
                        <TextField
                            type="text"
                            value={medicines}
                            onChange={handleMedicines}
                        />
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
                        <button variant="contained" style={{maxWidth: '100px', maxHeight: '100px', minWidth: '30px', minHeight: '30px'}} type="button"  onClick={uploadForm}>Submit</button>
                    </form>
                    </div>
                :""}
                {formChoice == 2?
                    <div className="form">
                    <form>
                        <label>
                            Patient Name:
                            <input type="text" value={patientName} onChange={handlePatientName} />
                            </label>
                        <br/><br/>
                        <label>
                            Issuer Name: 
                            <input type="text" value={issuerName} onChange={handleIssuerName} />
                        </label>
                        <br/><br/>
                        <TextField
                            id="date"
                            label="Choose Date"
                            type="date"
                            value={date}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleDate}
                        />
                        <br/><br/>
                        <label>
                            Amount: 
                            <input type="text" value={amount} onChange={handleAmount} />
                        </label>
                        <br/><br/>
                        <label>
                            Test List
                            <TextField
                                type="text"
                                value={test}
                                onChange={handleTestList}
                            />
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
                        <button variant="contained" style={{maxWidth: '100px', maxHeight: '100px', minWidth: '30px', minHeight: '30px'}} type="button"  onClick={uploadForm}>Submit</button>
                    </form>
                    </div>
                :""}
                {formChoice == 3?
                <div className="form">
                <form>
                    <label>
                        Patient Name:
                        <input type="text" value={patientName} onChange={handlePatientName} />
                        </label>
                    <br/><br/>
                    <label>
                        Issuer Name: 
                        <input type="text" value={issuerName} onChange={handleIssuerName} />
                    </label>
                    <br/><br/>
                    <TextField
                        id="date"
                        label="Choose Date"
                        type="date"
                        value={date}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={handleDate}
                    />
                    <br/><br/>
                    <label>
                        Days Admitted: 
                        <input type="text" value={admissionDays} onChange={handleAdmissionDays} />
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
                    <button variant="contained" style={{maxWidth: '100px', maxHeight: '100px', minWidth: '30px', minHeight: '30px'}} type="button"  onClick={uploadForm}>Submit</button>
                </form>
                </div>
                :""}
                {formChoice == 4?
                <div className="form">
                <form>
                    <label>
                        Patient Name:
                        <input type="text" value={patientName} onChange={handlePatientName} />
                        </label>
                    <br/><br/>
                    <label>
                        Issuer Name: 
                        <input type="text" value={issuerName} onChange={handleIssuerName} />
                    </label>
                    <br/><br/>
                    <TextField
                        id="date"
                        label="Choose Date"
                        type="date"
                        value={date}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={handleDate}
                    />
                    <br/><br/>
                    <label>
                        Amount: 
                        <input type="text" value={amount} onChange={handleAmount} />
                    </label>
                    <br/><br/>
                    <button variant="contained" style={{maxWidth: '100px', maxHeight: '100px', minWidth: '30px', minHeight: '30px'}} type="button"  onClick={uploadForm}>Submit</button>
                </form>
                </div>
                :""}
                </div>
            </div>

        ):""}
        {
        showDialog?(
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogContent>
              <DialogContentText>
               Following Patient Reports are being sent:  {selectionModel.map(val=><p>{val.split(" ")[0]}</p>)}
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
              <Button onClick={()=>{resolvePendingReports(String(selectionModel));handleClose()}}>Resolve</Button>
            </DialogActions>
          </Dialog>
        </div>):""}
     </div>
    )
}
export default HealthcareProfessionalView;