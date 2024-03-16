import React, { useEffect, useState, ReactNode } from "react";
import "./App.css";
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/UserAuthContext";
import { useAuth } from "./context/UserAuthContext";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Rules from "./pages/rules/Rules";
import Game from "./pages/game/Game";
import About from "./pages/about/About";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Router>
        {currentUser && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
