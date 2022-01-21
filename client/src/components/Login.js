import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkUser from "./auth/auth";
import Axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username_email, setUsername_email] = useState("");
  const [password, setPassword] = useState("");

  const [error, seterror] = useState("");

  useEffect(() => {
    //check whether user is already logged in or not
    const user = checkUser();
    if (user) {
      Axios.post("http://localhost:5000/api/user/profile", user, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      }).then((res) => {
        navigate("/profile");
      });
    }
  }, []);

  //user login function
  const UserLogin = (e) => {
    e.preventDefault();

    if (username_email === "" || password === "") {
      seterror("Please fill all the fields");
      return;
    }

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
        //save token to local storage
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      })
      .catch((err) => {
        seterror(err.response.data.msg);
      });
  };

  return (
    <div>
      <h1 className="text-center mb-4">Login</h1>
      <div style={{ margin: "" }} className="d-flex justify-content-center">
        <form style={{ width: "300px" }}>
          <div
            class="alert alert-danger text-center"
            role="alert"
            hidden={!error}
            style={{ fontSize: "12px", height: "30px", padding: "5px" }}
          >
            {error}
          </div>
          <div>
            <div class="form-floating mb-3">
              <input
                defaultValue={username_email}
                onChange={(e) => setUsername_email(e.target.value)}
                type="text"
                placeholder="Username / Email"
                className="form-control"
                id="floatingInput"
              />
              <label for="floatingInput">Username / Email</label>
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
              <label for="floatingInput">Email</label>
            </div>

            <button
              type="button"
              class="btn btn-dark w-100"
              onClick={UserLogin}
            >
              Sign up
            </button>
            <p
              className="text-end mt-2 text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Sign up instead
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
