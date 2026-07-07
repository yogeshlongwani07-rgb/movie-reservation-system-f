import api from "./api";

// GET /admin/listed-movies -> { movies: [...] } — movies created by the logged-in admin
async function getListedMovies() {
  const response = await api.get("/admin/listed-movies");
  return response.data.movies;
}

export { getListedMovies };
