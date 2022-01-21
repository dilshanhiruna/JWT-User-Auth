import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkUser from "./auth/auth";
import Swal from "sweetalert2";
import Axios from "axios";

const Profile = () => {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  const [changePassword, setchangePassword] = useState(false);

  const [error, seterror] = useState("");

  // Headers
  const config = {
    headers: { "x-auth-token": localStorage.getItem("token") },
  };

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    //check whether user is logged in or not (if not send back to the login page)
    const user = checkUser();
    if (user) {
      Axios.post("http://localhost:5000/api/user/profile", user, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
        .then((res) => {
          setFullName(res.data.fullname);
          setEmail(res.data.email);
          setUsername(res.data.username);
        })
        .catch((err) => {
          console.log(err.response.data);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  const updateUser = (e) => {
    e.preventDefault();

    //update user details only (expect password)
    if (!changePassword) {
      if (fullname === "" || email === "" || username === "") {
        seterror("Please fill all the fields");
        return;
      }
      if (!ValidateEmail(email)) {
        seterror("Invalid email");
        return;
      }
      // Request body
      const body = { fullname, email, username };

      Axios.put("http://localhost:5000/api/user/change-details", body, config)
        .then((res) => {
          seterror("");
          navigate("/profile");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.data.status,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } else {
      //update password only
      if (password === "" || comfirmPassword === "") {
        seterror("Please fill all the fields");
        return;
      }
      if (password.length < 5) {
        seterror("Password must be atleast 5 characters long");
        return;
      }
      if (password !== comfirmPassword) {
        seterror("Password not match");
        return;
      }

      // Request body
      const body = { password };

      Axios.put("http://localhost:5000/api/user/change-password", body, config)
        .then((res) => {
          seterror("");
          setchangePassword(false);
          navigate("/profile");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.data.status,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  return (
    <>
      <h1 className="text-center m-4">
        Profile
        <img
          alt="logout"
          src="https://img.icons8.com/external-others-sbts2018/58/000000/external-logout-social-media-others-sbts2018.png"
          style={{ width: "30px", marginLeft: "10px", cursor: "pointer" }}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />
      </h1>

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
          <div hidden={changePassword}>
            <div class="form-floating mb-3">
              <input
                defaultValue={fullname}
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
                defaultValue={email}
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
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                type="username"
                placeholder="Username"
                className="form-control"
                id="floatingInput"
              />
              <label for="floatingInput">Username</label>
            </div>
          </div>
          <div hidden={!changePassword}>
            <div class="form-floating mb-3">
              <input
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
                onChange={(e) => setComfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                id="floatingInput"
              />
              <label for="floatingInput">Confirm Password</label>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-secondary w-100 mb-2"
            onClick={() => {
              setchangePassword(!changePassword);
            }}
          >
            {changePassword ? "Cancel" : "Change Password"}
          </button>

          <button type="button" class="btn btn-dark w-100" onClick={updateUser}>
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
