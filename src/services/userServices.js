import axios from "axios";

async function createUser(userData) {
  return await axios.post("http://localhost:3000/api/user/register", userData, {
    withCredentials: true,
  });
}

async function loginUser(userData) {
  return await axios.post("http://localhost:3000/api/user/login", userData, {
    withCredentials: true,
  });
}

export { createUser, loginUser };
