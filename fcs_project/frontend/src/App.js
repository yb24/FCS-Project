import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LoginReg from "./pages/auth/LoginReg";
import ResetPassword from "./pages/auth/ResetPassword";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

import logo from './logo.svg';
import PatientView from './Components/PatientView';
import MakeBill from "./Components/MakeBill";
import HealthcareProfessionalsList from './Components/HealthcareProfessionalsList';
import HospitalsList from './Components/HospitalsList';
import InsuranceFirmsList from './Components/InsuranceFirmsList';
import PharmaciesList from './Components/PharmaciesList';
import MyDocuments from './Components/MyDocuments';
import SharedDocuments from './Components/SharedDocuments';
import PaymentsToBeMade from "./Components/PaymentsToBeMade";
import AllPayments from "./Components/AllPayments";


import './App.css';
import HealthcareProfessionalView from './Components/HealthcareProfessioanlView';
import PharmacyView from './Components/PharmacyView';
import InsuranceFirmView from './Components/InsuranceFirmView';
import Profile from './Components/Profile';
import RequestDocuments from "./Components/RequestDocuments";
import { getToken } from "./services/localStorageService";
import MyDocumentsWithRequests from "./Components/MyDocumentsWithRequests";
import Wallet from "./Components/Wallet";


function App() {
  // const {access_token} = getToken()
  // // const [role, setRole] = useState([]);
  // const role = "PT";

  // useEffect(() => {
  //   if(!access_token)
  //     return;
  //     axios({
  //       method: "POST",
  //       url:`${process.env.REACT_APP_BACKEND}/get_role`,
  //       data:{
  //           token: access_token,
  //       }
  //     }).then((response)=>{
  //         //console.log(response.data.role)
  //         // setRole(response.)
  //     }).catch((error) => {
  //     })
  // }, []); 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginReg />} />
          </Route>
          {/*<Route path="*" element={<h1>Error 404 Page not found !!</h1>} />*/}

          {<Route path="PatientView" >
          <Route index element={<PatientView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="Wallet" element={<Wallet />} />
          <Route path="HealthcareProfessionals" element={<HealthcareProfessionalsList />} />
          <Route path="Hospitals" element={<HospitalsList />} />
          <Route path="Pharmacies" element={<PharmaciesList />} />
          <Route path="InsuranceFirms" element={<InsuranceFirmsList />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="RequestDocuments" element={<RequestDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="PaymentsToBeMade" element={<PaymentsToBeMade />} />
          <Route path="AllPayments" element={<AllPayments />} />
        </Route>}    

        {/* User is Healthcare Professional */}
        { <Route path="HealthcareProfessioanlView" >
          <Route index element={<HealthcareProfessionalView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocumentsWithRequests />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
        </Route> } 

        {/* User is Hospital */}
        {<Route path="HospitalView" >
          <Route index element={<HealthcareProfessionalView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocumentsWithRequests />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
        </Route>  }


      {/* User is Pharmacy */}
      {<Route path="PharmacyView" >
          <Route index element={<PharmacyView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="Wallet" element={<Wallet />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="MakeBill" element={<MakeBill />} />
          <Route path="AllPayments" element={<AllPayments />} />
        </Route>  }


      {/* User is Insurance Firm */}
      {<Route path="InsuranceFirmView" >
          <Route index element={<InsuranceFirmView />} /> 
          <Route path="Wallet" element={<Wallet />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="MakeBill" element={<MakeBill />} />
          <Route path="PaymentsToBeMade" element={<PaymentsToBeMade />} />
          <Route path="AllPayments" element={<AllPayments />} />
        </Route>}   

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
