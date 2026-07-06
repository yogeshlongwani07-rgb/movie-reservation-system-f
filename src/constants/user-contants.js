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

const MOVIE_CATALOG = [
  {
    _id: 1,
    title: "Mission: Impossible",
    description: "Dead Reckoning Part One",
    rating: 8.6,
    language: "English",
    duration: "2h 43m",
    genre: ["Action", "Thriller"],
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    price: 220,
  },
  {
    _id: 2,
    title: "Kalki 2898 AD",
    description: "A sci-fi epic",
    rating: 8.7,
    language: "Telugu, Hindi",
    duration: "2h 56m",
    genre: ["Sci-Fi", "Action"],
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
    price: 250,
  },
  {
    _id: 3,
    title: "Garudan",
    description: "A tale of vengeance and honour",
    rating: 8.1,
    language: "Tamil",
    duration: "2h 21m",
    genre: ["Drama", "Action"],
    poster:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=600&auto=format&fit=crop",
    price: 200,
  },
  {
    _id: 4,
    title: "Furiosa",
    description: "A Mad Max Saga",
    rating: 8.3,
    language: "English",
    duration: "2h 28m",
    genre: ["Action", "Adventure"],
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
    price: 240,
  },
  {
    _id: 5,
    title: "Jawan",
    description: "One man, many battles",
    rating: 7.9,
    language: "Hindi",
    duration: "2h 49m",
    genre: ["Action", "Drama"],
    poster:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop",
    price: 210,
  },
  {
    _id: 6,
    title: "The Quiet Orbit",
    description: "Silence has a sound in space",
    rating: 8.0,
    language: "English",
    duration: "2h 12m",
    genre: ["Sci-Fi", "Drama"],
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop&sat=-100",
    price: 230,
  },
];

const GENRES = ["All", "Action", "Drama", "Sci-Fi", "Thriller", "Adventure"];

const THEATRES = [
  { id: "t1", name: "PVR Nexus", city: "Hyderabad" },
  { id: "t2", name: "INOX Forum", city: "Bengaluru" },
  { id: "t3", name: "Cinepolis Andheri", city: "Mumbai" },
];

const SHOWTIMES = ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM", "10:45 PM"];

const PAYMENT_METHODS = [
  { key: "card", label: "Credit / Debit Card", icon: "card" },
  { key: "upi", label: "UPI", icon: "wallet" },
  { key: "netbanking", label: "Net Banking", icon: "shield" },
];

const MOCK_BOOKINGS = [
  {
    id: "MVQ48213",
    movie: "Jawan",
    poster:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop",
    theatre: "PVR Nexus, Hyderabad",
    date: "12 Jul 2026",
    time: "8:15 PM",
    seats: ["E15", "E16"],
    amount: 420,
    status: "Upcoming",
  },
  {
    id: "MVQ48117",
    movie: "Furiosa",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=300&auto=format&fit=crop",
    theatre: "INOX Forum, Bengaluru",
    date: "2 Jun 2026",
    time: "5:00 PM",
    seats: ["C8", "C9"],
    amount: 480,
    status: "Completed",
  },
];

export {
  NAV_SECTIONS,
  avatar,
  sample,
  MOCK_MOVIES,
  MOVIE_CATALOG,
  GENRES,
  THEATRES,
  SHOWTIMES,
  PAYMENT_METHODS,
  MOCK_BOOKINGS,
};
