import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username_email, setUsername_email] = useState("");
  const [password, setPassword] = useState("");

  const UserLogin = (e) => {
    e.preventDefault();

    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Request body
    const payload = JSON.stringify({ username_email, password });

    Axios.post("http://localhost:5000/api/user/login", payload, config)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          value={username_email}
          onChange={(e) => setUsername_email(e.target.value)}
          type="text"
          placeholder="Username / Email"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <button type="button" onClick={UserLogin}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
