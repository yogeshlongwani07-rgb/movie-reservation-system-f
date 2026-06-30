import axios from "axios";

async function createAdmin(adminData) {
  return await axios.post(
    "http://localhost:3000/api/admin/register",
    adminData,
    {
      withCredentials: true,
    },
  );
}

export { createAdmin };
