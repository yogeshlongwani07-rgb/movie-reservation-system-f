import api from "./api";

async function getFewMovies() {
  try {
    const response = await api.get("/movie?page=1&limit=2");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default getFewMovies;
