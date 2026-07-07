import api from "./api";

// GET /user/my-bookings -> { bookings: [...] }
async function getMyBookings() {
  const response = await api.get("/user/my-bookings");
  return response.data.bookings;
}

// POST /user/cancel-booking/:bookingId
async function cancelBooking(bookingId) {
  const response = await api.post(`/user/cancel-booking/${bookingId}`);
  return response.data;
}

export { getMyBookings, cancelBooking };
