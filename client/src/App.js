import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Login from "./components/Login";

function App() {
  return (
    <div className="container" style={{ margin: "auto", marginTop: "200px" }}>
      <Router>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/" exact element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
