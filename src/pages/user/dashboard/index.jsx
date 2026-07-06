import { useState, useEffect } from "react";
import "../../../css/userDashboard.css";
import Icon from "../dashboard/components/icon";
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

const MOCK_MOVIES = [
  {
    _id: 1,
    title: "Mission: Impossible",
    description: "Dead Reckoning Part One",
    rating: 8.6,
    language: "English",
    duration: "2h 43m",
  },
  {
    _id: 2,
    title: "Kalki 2898 AD",
    description: "A sci-fi epic",
    rating: 8.7,
    language: "Telugu, Hindi",
    duration: "2h 56m",
  },
];
export default function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showMovies, setShowMovies] = useState([]);
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

  function renderPage() {
    switch (activePage) {
      case "movies":
        return <Movies />;
      case "shows":
        return <Shows />;
      case "bookings":
        return <Bookings />;
      case "profile":
        return <ProfilePage />;
      case "payment":
        return <Payment />;
      default:
        return <Hero movies={movies} />;
    }
  }

  return (
    <div className="Dashboard">
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Navbar user={user} />

        <div className="profile-and-poster">
          {renderPage(activePage)}
          {activePage === "dashboard" && <Profile user={user} />}
        </div>
      </div>
    </div>
  );
}
