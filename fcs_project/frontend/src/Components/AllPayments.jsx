import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';


function AllPayments(){


    const [payments, setPayments] = useState([])
    let {access_token, refresh_token} = getToken()
    let userID = JSON.parse(window.atob(access_token.split('.')[1]))
    userID = userID['user_id'] 

    const FetchPayments  =()=>{

        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/display_all_payment_records`,
            data:{
                token: access_token,
                userID: userID,
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setPayments(data)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              }
          })
    }

    useEffect(()=>{

        FetchPayments()
        
    }, [])


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
        { field: 'payerEmail', headerName: 'Payer Email ID', width: 300 },
        { field: 'receiverEmail', headerName: 'Receiver Email ID', width:300 },
        { field: 'amount', headerName: 'Amount', width:300 },
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


export default AllPayments;