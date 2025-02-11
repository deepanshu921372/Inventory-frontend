import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import ScanPage from "./ScanPage";
import InventoryList from "./InventoryList";
import FamilyInfo from "./FamilyInfo";
import CameraCapture from "./CameraCapture";

const App = () => {
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = React.useState(storedDarkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/scan" element={<ScanPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/inventory" element={<InventoryList darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/family" element={<FamilyInfo darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/camera" element={<CameraCapture />} />
      </Routes>
    </Router>
  );
};

export default App;
