import { useState, useEffect, useMemo, useCallback } from "react";
import "../../../css/userDashboard.css";
import SideBar from "./components/sidebar";
import Profile from "./components/profile";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Movies from "../movie-discovery/movies";
import Shows from "../movie-discovery/shows";
import Bookings from "../activites/bookings";
import ProfilePage from "../account/profile";
import Payment from "../account/payment";
import Loading from "../../loading";
import { useAuth } from "../../../context/authContext";
import { getMovies } from "../../../services/movieService";
import { getMyBookings, cancelBooking } from "../../../services/bookingService";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingDraft, setBookingDraft] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const fetchMovies = useCallback(async () => {
    setMoviesLoading(true);
    try {
      const data = await getMovies(1, 50);
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setMoviesLoading(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
    fetchBookings();
  }, [fetchMovies, fetchBookings]);

  const moviesMap = useMemo(() => {
    const map = {};
    movies.forEach((m) => {
      map[m._id] = m;
    });
    return map;
  }, [movies]);

  function goToShows(movie) {
    setSelectedMovie(movie);
    setBookingDraft(null);
    setActivePage("shows");
  }

  function goToPayment(draft) {
    setBookingDraft(draft);
    setActivePage("payment");
  }

  async function handleBooked() {
    setBookingDraft(null);
    setSelectedMovie(null);
    setActivePage("bookings");
    await fetchBookings();
  }

  async function handleCancelBooking(bookingId) {
    try {
      await cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not cancel this booking.");
    }
  }

  function handleSearch(q) {
    setSearchQuery(q);
    setActivePage("movies");
  }

  function renderPage() {
    switch (activePage) {
      case "movies":
        return (
          <Movies
            movies={movies}
            loading={moviesLoading}
            onBook={goToShows}
            initialQuery={searchQuery}
          />
        );
      case "shows":
        return (
          <Shows
            movie={selectedMovie}
            onConfirm={goToPayment}
            onBack={() => setActivePage("movies")}
          />
        );
      case "payment":
        return (
          <Payment
            booking={bookingDraft}
            onBooked={handleBooked}
            onBack={() => setActivePage("shows")}
          />
        );
      case "bookings":
        return (
          <Bookings
            bookings={bookings}
            loading={bookingsLoading}
            moviesMap={moviesMap}
            onCancel={handleCancelBooking}
            onBrowse={() => setActivePage("movies")}
          />
        );
      case "profile":
        return (
          <ProfilePage
            user={user}
            bookingsCount={
              bookings.filter((b) => b.status === "Confirmed").length
            }
          />
        );
      default:
        return (
          <Hero
            movies={movies}
            loading={moviesLoading}
            setActivePage={setActivePage}
          />
        );
    }
  }

  const showSidePanel = activePage === "dashboard";

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="Dashboard">
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Navbar
          user={user}
          bookings={bookings}
          moviesMap={moviesMap}
          onSearch={handleSearch}
          onOpenProfile={() => setActivePage("profile")}
        />

        <div className={`profile-and-poster ${showSidePanel ? "" : "is-full"}`}>
          {renderPage(activePage)}
          {showSidePanel && <Profile user={user} />}
        </div>
      </div>
    </div>
  );
}
