import api from "./api";

// GET /api/v1/movie?page=&limit=
export async function getMovies(page = 1, limit = 10) {
  const response = await api.get(`/movie?page=${page}&limit=${limit}`);
  return response.data;
}

// GET /api/v1/movie/shows/:id  -> all shows for a movie
export async function getShowsForMovie(movieId) {
  const response = await api.get(`/movie/shows/${movieId}`);
  return response.data;
}

// GET /api/v1/movie/:id/show/:showId -> single show incl. seat layout/status
export async function getShowDetails(movieId, showId) {
  const response = await api.get(`/movie/${movieId}/show/${showId}`);
  return response.data;
}

// POST /api/v1/movie/:id/show/:showId/hold  body: { seatNumber: [...] }
// Locks the seats for ~10 minutes under the current user. Backend emits
// "seat:held" over the socket to everyone else viewing this show.
export async function holdSeats(movieId, showId, seatNumber) {
  const response = await api.post(`/movie/${movieId}/show/${showId}/hold`, {
    seatNumber,
  });
  return response.data;
}

// POST /api/v1/movie/:id/show/:showId/book  body: { seatNumber: [...] }
// Confirms a booking for seats the user already holds. Backend emits
// "seat:booked" over the socket to everyone else viewing this show.
export async function bookSeats(movieId, showId, seatNumber) {
  const response = await api.post(`/movie/${movieId}/show/${showId}/book`, {
    seatNumber,
  });
  return response.data;
}
