import { BrowserRouter, Routes, Route, Link } from 'react-router'
import './App.css'
import Deck from './Deck'
import { useState, useEffect } from 'react';

function App() {

  const [deck, setDeck] = useState([]);

  let fetchedDeck = false;

  useEffect(() => {
    const fetchDeck = async () => {
      if (!fetchedDeck) {
        try {
          const response = await fetch("http://localhost:3000/api/deck");
          if (!response.ok) {
            throw new Error(`HTTP error: , ${response.status}`);
          }
          const data = await response.json();
          setDeck(data);
          fetchedDeck = true;
        } catch (error) {
          console.error('Error message: ', error);
        }
      }
    }
    fetchDeck();

  }, []);


  return (
    <BrowserRouter>
      {/* <Deck fetchedDeck = {deck}/> */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/deck">Deck</Link> |{" "}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to Cambio!</h1>} />
        <Route path="/deck" element={<Deck fetchedDeck={deck} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
