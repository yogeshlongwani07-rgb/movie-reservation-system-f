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

export { getMovies, getMovieShows, getShow, holdSeats, bookSeats };
