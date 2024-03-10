import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
// import Rules from './pages/Rules';
import Game from "./pages/game/Game";
// import About from './pages/About';
// import SignUp from './pages/SignUp';
// import Login from './pages/Login';
import TicTacToe from "./pages/experiment/TicTacToe";
import TSTut from "./pages/experiment/TSTut";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/rules" element={<Rules />} /> */}
          <Route path="/game" element={<Game />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} /> */}
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/tstut" element={<TSTut />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
