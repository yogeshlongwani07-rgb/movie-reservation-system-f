import { useState, useEffect } from "react";
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
import { useAuth } from "../../../context/authContext";
import getFewMovies from "../../../services/getFewMovies";
import { MOCK_MOVIES, MOCK_BOOKINGS } from "../../../constants/user-contants";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showMovies, setShowMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const { user } = useAuth();

  useEffect(() => {
    async function showCaseMovies() {
      try {
        const data = await getFewMovies();
        setShowMovies(data);
      } catch (err) {
        console.error(err);
      }
    }
    showCaseMovies();
  }, []);

  const movies = showMovies.length >= 2 ? showMovies : MOCK_MOVIES;

  function goToShows(movie) {
    setSelectedMovie(movie);
    setActivePage("shows");
  }

  function goToPayment(draft) {
    setBookingDraft(draft);
    setActivePage("payment");
  }

  function confirmBooking(finalBooking) {
    const newBooking = {
      id: `MVQ${Math.floor(10000 + Math.random() * 89999)}`,
      movie: finalBooking.movie.title,
      poster: finalBooking.movie.poster,
      theatre: `${finalBooking.theatre.name}, ${finalBooking.theatre.city}`,
      date: finalBooking.date,
      time: finalBooking.time,
      seats: finalBooking.seats,
      amount: finalBooking.amount,
      status: "Upcoming",
    };
    setBookings((prev) => [newBooking, ...prev]);
    setBookingDraft(null);
    setSelectedMovie(null);
    setActivePage("bookings");
  }

  function cancelBooking(id) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    );
  }

  function renderPage() {
    switch (activePage) {
      case "movies":
        return <Movies onBook={goToShows} />;
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
            onPay={confirmBooking}
            onBack={() => setActivePage("shows")}
          />
        );
      case "bookings":
        return (
          <Bookings
            bookings={bookings}
            onCancel={cancelBooking}
            onBrowse={() => setActivePage("movies")}
          />
        );
      case "profile":
        return (
          <ProfilePage
            user={user}
            bookingsCount={
              bookings.filter((b) => b.status !== "Cancelled").length
            }
          />
        );
      default:
        return <Hero movies={movies} setActivePage={setActivePage} />;
    }
  }

  const showSidePanel = activePage === "dashboard";

  return (
    <div className="Dashboard">
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Navbar user={user} />

        <div className={`profile-and-poster ${showSidePanel ? "" : "is-full"}`}>
          {renderPage(activePage)}
          {showSidePanel && <Profile user={user} />}
        </div>
      </div>
    </div>
  );
}
