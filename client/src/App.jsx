import { BrowserRouter, Routes, Route, Link } from 'react-router'
import './App.css'
import CardGrid from './CardGrid';  
import Hand from './Hand';
import Game from './Game';
import { useState, useEffect } from 'react';

function App() {


  return (
    <BrowserRouter>
      {/* <Deck fetchedDeck = {deck}/> */}
      <nav>
        {" "} | <Link to="/">Home</Link> |{" "}
        <Link to="/card-grid">Card Grid</Link> |{" "}
        <Link to="/hand">Hand</Link> | {" "}
        <Link to="/game">Game</Link> | {" "}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to Cambio!</h1>} />
        <Route path="/card-grid" element={<CardGrid />} />
        <Route path="/hand" element={<Hand />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
