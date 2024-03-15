import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Rules from "./pages/rules/Rules";
import Game from "./pages/game/Game";
import About from "./pages/about/About";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Ensure User is imported

const auth = getAuth();

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        console.log(userAuth);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={user ? <Login currentUser={user} /> : <Home />}
          />
          <Route path="/rules" element={<Rules />} />
          <Route path="/game" element={<Game />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login currentUser={user} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
