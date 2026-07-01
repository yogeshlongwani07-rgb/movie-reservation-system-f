import api from "./api";

async function createUser(userData) {
  return await api.post("/user/register", userData);
}

async function loginUser(userData) {
  return await api.post("/user/login", userData);
}

export { createUser, loginUser };
