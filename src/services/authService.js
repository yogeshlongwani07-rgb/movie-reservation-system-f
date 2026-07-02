import api from "./api";

async function create(credentials, role) {
  return await api.post(`/${role}/register`, credentials);
}

async function validate(payload, role) {
  return await api.post(`/${role}/login`, payload);
}

export { create, validate };
