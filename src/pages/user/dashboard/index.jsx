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

const MOCK_USER = {
  name: "Yogesh Longwani",
  greetingName: "Yogesh",
  email: "yogesh@example.com",
  isPremium: true,
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop",
  stats: [
    { key: "bookings", label: "Bookings", value: 12, icon: "ticket" },
    { key: "wishlist", label: "Wishlist", value: 8, icon: "heart" },
    { key: "reviews", label: "Reviews", value: 24, icon: "star" },
    { key: "saved", label: "Saved", value: "₹2,450", icon: "wallet" },
  ],
};
const MOCK_MOVIES = [
  {
    id: 1,
    tag: "NOW IN CINEMAS",
    title: "Mission: Impossible",
    subtitle: "Dead Reckoning Part One",
    rating: 8.6,
    language: "English",
    duration: "2h 43m",
    backdrop:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "NEW RELEASE",
    title: "Kalki 2898 AD",
    subtitle: "A sci-fi epic",
    rating: 8.7,
    language: "Telugu, Hindi",
    duration: "2h 56m",
    backdrop:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",
  },
];
export default function UserDashboard() {
  const [movies] = useState(MOCK_MOVIES);
  const [user] = useState(MOCK_USER);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(
      () => setActiveSlide((i) => (i + 1) % movies.length),
      4000,
    );
    return () => clearInterval(t);
  }, [movies.length]);

  function renderPage() {
    switch (activePage) {
      case "Movies":
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
        return <Hero movie={movie} movies={movies} activeSlide={activeSlide} />;
    }
  }

  const movie = movies[activeSlide];

  return (
    <div className="Dashboard">
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Navbar user={user} />

        <div className="profile-and-poster">
          {renderPage(activePage)}
          <Profile user={user} />
        </div>
      </div>
    </div>
  );
}
