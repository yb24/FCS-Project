import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Patient Management System
        </h1>
        <p>
          FCS Group 20
        </p>
        <ul style={{textAlign:"left"}}>
            <li>Harman Singh - 2019042</li>
            <li>Yash Bhargava - 2019289</li>
            <li>Tarini Sharma - 2019451</li>
            <li>Aryan Behal - 2019026</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
