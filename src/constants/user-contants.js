const NAV_SECTIONS = [
  {
    label: "Movie Discovery",
    items: [
      { key: "movies", label: "Movies", icon: "film" },
      { key: "shows", label: "Shows", icon: "calendar" },
    ],
  },
  {
    label: "My Activities",
    items: [
      { key: "bookings", label: "My Bookings", icon: "clipboard" },
      // { key: "wishlist", label: "Wishlist", icon: "heart" },
      // { key: "reviews", label: "Reviews & Ratings", icon: "star" },
    ],
  },
  {
    label: "My Account",
    items: [
      { key: "profile", label: "Profile", icon: "user" },
      { key: "payment", label: "Payment Methods", icon: "card" },
      // { key: "settings", label: "Settings", icon: "settings" },
    ],
  },
];

const avatar =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop";

const sample = [
  {
    url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    tag: "NOW IN CINEMAS",
  },
  {
    url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",
    tag: "NEW RELEASE",
  },
];

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

export { NAV_SECTIONS, avatar, sample, MOCK_MOVIES };
