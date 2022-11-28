import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { getToken } from '../services/localStorageService';
import {useNavigate} from 'react-router-dom';

function AllPayments(){
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
          if (!(role=="PH" || role=="IF" || role=="PT" || role=="AD") || response.data.userStatus!="AU")
          {
              navigate("../../")
          }
          else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PatientView/AllPayments'.toLowerCase() && !(role=="PT" || role=="AD"))
          {
            navigate("../../")
          }
          else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/PharmacyView/AllPayments'.toLowerCase() && !(role=="PH" || role=="AD"))
          {
            navigate("../../")
          }
          else if(window.location.href.toLowerCase()==process.env.REACT_APP_FRONTEND+'/InsuranceFirmView/AllPayments'.toLowerCase() && !(role=="IF" || role=="AD"))
          {
            navigate("../../")
          }
      }).catch((error) => {
        navigate("../../")
      })
  }, []); 
    const [payments, setPayments] = useState([])
    let {access_token} = getToken()

    const FetchPayments  =()=>{

        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/display_all_payment_records`,
            data:{
                token: access_token,
            }
          }).then((response)=>{
            const data = response.data
            setPayments(data)
          }).catch((error) => {
            if (error.response) {
              //console.log(error.response.data);
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
        { field: 'payerEmail', headerName: 'Payer Email ID', width: 600 },
        { field: 'receiverEmail', headerName: 'Receiver Email ID', width:600 },
        { field: 'amount', headerName: 'Amount', width:600 },
        { field: 'status', headerName: 'Status', width:600 },
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