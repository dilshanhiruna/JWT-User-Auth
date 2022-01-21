import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import jwt from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (user) {
        navigate("/profile");
      }
    }
  }, []);

  const UserRegister = (e) => {
    e.preventDefault();
    if (password !== comfirmPassword) {
      alert("Password not match");
      return;
    }
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Request body
    const payload = JSON.stringify({ fullname, email, username, password });

    Axios.post("http://localhost:5000/api/user/register", payload, config)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form>
        <input
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
        />
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="username"
          placeholder="Username"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <input
          value={comfirmPassword}
          onChange={(e) => setComfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
        />
        <br />
        <button type="button" onClick={UserRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
