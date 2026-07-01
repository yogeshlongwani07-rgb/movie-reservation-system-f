import api from "./api";

async function createAdmin(adminData) {
  return await api.post("/admin/register", adminData);
}

async function loginAdmin(adminData) {
  return await api.post("/admin/login", adminData);
}

export { createAdmin, loginAdmin };
