import logo from './logo.svg';
import PatientView from './Components/PatientView';
import HealthcareProfessionalsList from './Components/HealthcareProfessionalsList';
import HospitalsList from './Components/HospitalsList';
import InsuranceFirmsList from './Components/InsuranceFirmsList';
import PharmaciesList from './Components/PharmaciesList';
import MyDocuments from './Components/MyDocuments';
import SharedDocuments from './Components/SharedDocuments';
import PaymentsMade from './Components/PaymentsMade';
import PaymentsReceived from './Components/PaymentsReceived';

import {Routes, Route, useNavigate} from 'react-router-dom';
import './App.css';
import HealthcareProfessionalView from './Components/HealthcareProfessioanlView';
import PharmacyView from './Components/PharmacyView';
import InsuranceFirmView from './Components/InsuranceFirmView';
import Profile from './Components/Profile';



function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <h1>
    //       Patient Management System
    //     </h1>
    //     <p>
    //       FCS Group 20
    //     </p>
    //     <ul style={{textAlign:"left"}}>
    //         <li>Harman Singh - 2019042</li>
    //         <li>Yash Bhargava - 2019289</li>
    //         <li>Tarini Sharma - 2019451</li>
    //         <li>Aryan Behal - 2019026</li>
    //     </ul>
    //   </header>
    // </div>

    <div>
      <Routes>
        <Route path="/" element={<Home />}/>  

        {/* If user is patient, redirect to url/PatientView and allow only these sub routes */}
        <Route path="PatientView" >
          <Route index element={<PatientView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="HealthcareProfessionals" element={<HealthcareProfessionalsList />} />
          <Route path="Hospitals" element={<HospitalsList />} />
          <Route path="Pharmacies" element={<PharmaciesList />} />
          <Route path="InsuranceFirms" element={<InsuranceFirmsList />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="PaymentsMade" element={<PaymentsMade />} />
          <Route path="PaymentsReceived" element={<PaymentsReceived />} />
        </Route>    

        {/* User is Healthcare Professional */}
        <Route path="HealthcareProfessioanlView" >
          <Route index element={<HealthcareProfessionalView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
        </Route>  


        {/* User is Hospital */}
        <Route path="HospitalView" >
          <Route index element={<HealthcareProfessionalView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
        </Route>  


      {/* User is Pharmacy */}
        <Route path="PharmacyView" >
          <Route index element={<PharmacyView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="PaymentsReceived" element={<PaymentsReceived />} />
        </Route>  


      {/* User is Insurance Firm */}
        <Route path="InsuranceFirmView" >
          <Route index element={<InsuranceFirmView />} /> 
          <Route path="Profile" element={<Profile />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
          <Route path="PaymentsMade" element={<PaymentsMade />} />
        </Route>   
      </Routes>
    </div>
  );
}

function Home(){
  return <h1>Hallo!</h1>
}

export default App;
