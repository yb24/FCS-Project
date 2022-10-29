import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import HealthcareProfessionalView from './Components/HealthcareProfessionalView'
import './App.css';

function App() {
  const pages = ['HealthcareProfessionalView']
  const [currPage, setCurrPage] = useState(pages[0]);
  function openPage(page) {
    setCurrPage(page);
  }
  const page_component = {
    'HealthcareProfessionalView': <HealthcareProfessionalView />,
  }
  return (
    <div className="App">
      <header className="App-header">
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
            {page_component[currPage]}
      </header>
    </div>
  );
}

export default App;
