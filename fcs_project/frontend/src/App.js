import React, { useState } from 'react';
import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import HealthcareProfessionalView from './Components/HealthcareProfessionalView'
import PharmacyView from './Components/PharmacyView'
import InsuranceView from './Components/InsuranceView'
import './App.css';

function App() {
  const pages = ['HealthcareProfessionalView', 'PharmacyView', 'InsuranceView']
  const [currPage, setCurrPage] = useState(pages[0]);
  function openPage(page) {
    setCurrPage(page);
  }
  const page_component = {
    'HealthcareProfessionalView': <HealthcareProfessionalView />,
    'PharmacyView': <PharmacyView />,
    'InsuranceView': <InsuranceView/>
  }
  return (
    <div className="App">
        <AppBar>
                <Toolbar>
                    {pages.map((page) => (
                        <Button
                        key={page}
                        onClick={() => openPage(page)}
                        sx={{ color: 'white', display: 'block' }}
                        >
                        {page}
                        </Button>
                    ))}
                </Toolbar>
        </AppBar>
      <div>{page_component[currPage]}</div>
    </div>
  );
}

export default App;
