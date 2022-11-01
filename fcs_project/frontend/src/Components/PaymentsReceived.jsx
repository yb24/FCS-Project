import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";



function PaymentsReceived(){


    const [payments, setPayments] = useState([])

    const FetchPayments  =()=>{

        setPayments([
            {'type':'Prescription', 'doc':'xxyyzz', 'shared_by':'harman.iiit@gmail.com', 'report_id':101},
            {'type': 'Discharge Summary', 'doc':'lolol', 'shared_by':'harman.iiit@gmail.com', 'report_id':201}
        ])
    }

    useEffect(()=>{

        FetchPayments()
        
    }, [payments])


      function PaymentsFilters() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport 
            csvOptions={{
                fileName: 'Payments',
              }}/>
          </GridToolbarContainer>
        );
      }


      const paymentsColumns = [
        { field: 'email', headerName: 'Email ID of Sender', width: 300 },
        { field: 'amount', headerName: 'Bill Amount', width:300 },
        { field: 'status', headerName: 'Status', width:300 },
      ];



    return(
        <div style={{margin:10, justifyContent:'center'}}>

           <div style={{ height: 300, width: '100%' }} >
         Payments Received
            <DataGrid 
                rows={payments}
                columns={paymentsColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={row =>  row.id}
                components={{Toolbar: PaymentsFilters,}}
            />
         

        </div>

        </div>
    )

}


export default PaymentsReceived;