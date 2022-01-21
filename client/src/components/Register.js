import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

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
    <>
      <h1 className="text-center mb-4">Register</h1>
      <div style={{ margin: "" }} className="d-flex justify-content-center">
        <form style={{ width: "300px" }}>
          <div class="form-floating mb-3">
            <input
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Full Name"
            />
            <label for="floatingInput">Full Name</label>
          </div>
          <div class="form-floating mb-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Email</label>
          </div>

          <div class="form-floating mb-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              placeholder="Username"
              className="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Username</label>
          </div>

          <div class="form-floating mb-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Password</label>
          </div>

          <div class="form-floating mb-3">
            <input
              value={comfirmPassword}
              onChange={(e) => setComfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              id="floatingInput"
            />
            <label for="floatingInput">Confirm Password</label>
          </div>

          <button
            type="button"
            class="btn btn-dark w-100"
            onClick={UserRegister}
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
