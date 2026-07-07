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
  {
    url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop",
    tag: "TRENDING",
  },
];

const PAYMENT_METHODS = [
  { key: "card", label: "Credit / Debit Card", icon: "card" },
  { key: "upi", label: "UPI", icon: "wallet" },
  { key: "netbanking", label: "Net Banking", icon: "shield" },
];

export { NAV_SECTIONS, avatar, sample, PAYMENT_METHODS };
