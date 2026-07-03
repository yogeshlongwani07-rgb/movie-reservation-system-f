import api from "./api";

async function create(credentials, role) {
  return await api.post(`/${role}/register`, credentials);
}

async function validate(payload, role) {
  return await api.post(`/${role}/login`, payload);
}

async function getProfile(role) {
  return await api.get(`/${role}/auth-me`);
}

export { create, validate, getProfile };
