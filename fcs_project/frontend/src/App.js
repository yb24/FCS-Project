import logo from './logo.svg';
import PatientView from './Components/PatientView';
import HealthcareProfessionalsList from './Components/HealthcareProfessionalsList';
import HospitalsList from './Components/HospitalsList';
import InsuranceFirmsList from './Components/InsuranceFirmsList';
import PharmaciesList from './Components/PharmaciesList';
import MyDocuments from './Components/MyDocuments';
import SharedDocuments from './Components/SharedDocuments';
import {Routes, Route, useNavigate} from 'react-router-dom';
import './App.css';



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
        <Route path="PatientView" >
          <Route index element={<PatientView />} /> 
          <Route path="HealthcareProfessionals" element={<HealthcareProfessionalsList />} />
          <Route path="Hospitals" element={<HospitalsList />} />
          <Route path="Pharmacies" element={<PharmaciesList />} />
          <Route path="InsuranceFirms" element={<InsuranceFirmsList />} />
          <Route path="MyDocuments" element={<MyDocuments />} />
          <Route path="SharedDocuments" element={<SharedDocuments />} />
        </Route>     
      </Routes>
    </div>
  );
}

function Home(){
  return <h1>Hallo!</h1>
}

export default App;
