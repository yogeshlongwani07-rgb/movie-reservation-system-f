import api from "./api";

async function create(adminData, role) {
  return await api.post(`/${role}/register`, adminData);
}

async function validate(adminData, role) {
  return await api.post(`/${role}/login`, adminData);
}

export { create, validate };
