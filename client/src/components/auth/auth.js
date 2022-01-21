import jwt from "jwt-decode";

const checkUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const user = jwt(token);
    if (user.id) {
      return user.id;
    }
    else {
      return null;
    }
  }
};

export default checkUser;
