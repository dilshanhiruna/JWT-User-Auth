import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkUser from "./auth/auth";
import Axios from "axios";

const Profile = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  useEffect(() => {
    const user = checkUser();
    if (user) {
      Axios.post("http://localhost:5000/api/user/profile", user, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <form>
        <input
          value={user.fullname}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
        />
        <br />
        <input
          value={user.email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input
          value={user.username}
          onChange={(e) => setUsername(e.target.value)}
          type="username"
          placeholder="Username"
        />
        <br />
        <button type="button">Register</button>
      </form>
    </div>
  );
};

export default Profile;
