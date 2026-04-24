import { BrowserRouter, Routes, Route, Link } from 'react-router'
import './App.css'
import Deck from './Deck'
import Hand from './Hand';
import { useState, useEffect } from 'react';

function App() {


  return (
    <BrowserRouter>
      {/* <Deck fetchedDeck = {deck}/> */}
      <nav>
        {" "} | <Link to="/">Home</Link> |{" "}
        <Link to="/deck">Deck</Link> |{" "}
        <Link to="/hand">Hand</Link> | {" "}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to Cambio!</h1>} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/hand" element={<Hand />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
