import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [page, setPage] = useState<Object[]>();

  const getAllRecipes = async () => {
    const response = await fetch('http://localhost:3001/recipe');
    const data: Object[] = await response.json();
    console.log(data);
    setPage(data);
  }

  useEffect(() => {
    getAllRecipes()
    console.log(page)
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
