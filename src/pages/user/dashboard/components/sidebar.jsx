import Icon from "../components/icon";

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

export default function SideBar({ activePage, setActivePage }) {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">
            <Icon name="film" size={20} />
          </span>
          <div>
            <p className="sidebar-brand-name">Movieq</p>
            <p className="sidebar-brand-tag">Book. Watch. Enjoy.</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${
              activePage === "dashboard" ? "is-active" : ""
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            <Icon name="dashboard" size={18} />
            Dashboard
          </button>

          {NAV_SECTIONS.map((section) => (
            <div className="sidebar-group" key={section.label}>
              <p className="sidebar-group-label">{section.label}</p>
              {section.items.map((item) => (
                <button
                  className="sidebar-link"
                  key={item.key}
                  className={`sidebar-link ${
                    activePage === item.key ? "is-active" : ""
                  }`}
                  onClick={() => setActivePage(item.key)}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-promo">
          <p className="sidebar-promo-title">Weekend Offer!</p>
          <p className="sidebar-promo-copy">
            Get up to 25% off on your movie tickets
          </p>
          <button className="btn btn-light">Book Now</button>
        </div>

        <button className="sidebar-link  sidebar-logout">
          <Icon name="logout" size={18} />
          Logout
        </button>
      </aside>
      ;
    </>
  );
}
