import api from "./api";

// GET /movie?page=&limit=  -> raw array of movie documents (public)
async function getMovies(page = 1, limit = 50) {
  const response = await api.get(`/movie?page=${page}&limit=${limit}`);
  return response.data;
}

// GET /movie/shows/:id -> { success, message, shows: [...] } all shows for one movie
async function getMovieShows(movieId) {
  const response = await api.get(`/movie/shows/${movieId}`);
  return response.data.shows;
}

// GET /movie/:id/show/:showId -> { success, message, show: {...} } live seat map
async function getShow(movieId, showId) {
  const response = await api.get(`/movie/${movieId}/show/${showId}`);
  return response.data.show;
}

// POST /movie/:id/show/:showId/hold  body: { seatNumber: [...] }
async function holdSeats(movieId, showId, seatNumbers) {
  const response = await api.post(`/movie/${movieId}/show/${showId}/hold`, {
    seatNumber: seatNumbers,
  });
  return response.data;
}

// POST /movie/:id/show/:showId/book  body: { seatNumber: [...] }
async function bookSeats(movieId, showId, seatNumbers) {
  const response = await api.post(`/movie/${movieId}/show/${showId}/book`, {
    seatNumber: seatNumbers,
  });
  return response.data;
}

// POST /movie/create  (admin only) body: { title, description, language, duration, rating, price, shows: [...] }
async function createMovie(payload) {
  const response = await api.post("/movie/create", payload);
  return response.data;
}

// PUT /movie/update/:id (admin only, own movies) — NOTE: the backend replaces
// whatever fields you send as-is. Avoid sending `shows` here: unlike /create,
// update does not regenerate the seat map, so it's only safe to patch the
// plain fields (title, description, language, duration, rating, price).
async function updateMovie(id, payload) {
  const response = await api.put(`/movie/update/${id}`, payload);
  return response.data;
}

// DELETE /movie/delete/:id (admin only, own movies)
async function deleteMovie(id) {
  const response = await api.delete(`/movie/delete/${id}`);
  return response.data;
}

export {
  getMovies,
  getMovieShows,
  getShow,
  holdSeats,
  bookSeats,
  createMovie,
  updateMovie,
  deleteMovie,
};
