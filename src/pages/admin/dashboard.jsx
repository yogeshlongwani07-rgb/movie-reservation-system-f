import { useState } from "react";
import "../../css/adminDashboard.css";

// ---- Mock data — replace with your backend fetches ----
const STAT_CARDS = [
  {
    key: "bookings",
    label: "Total Bookings",
    value: "12,458",
    delta: "18.6%",
    icon: "ticket",
    tone: "violet",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    value: "₹28,75,850",
    delta: "22.4%",
    icon: "wallet",
    tone: "green",
  },
  {
    key: "users",
    label: "Active Users",
    value: "8,842",
    delta: "12.8%",
    icon: "user",
    tone: "amber",
  },
  {
    key: "movies",
    label: "Total Movies",
    value: "48",
    delta: "4",
    icon: "film",
    tone: "pink",
  },
];

const THEATRE_PERFORMANCE = [
  {
    id: 1,
    name: "PVR Nexus",
    city: "Hyderabad",
    occupancy: 88,
    revenue: "₹4,82,300",
  },
  { id: 2, name: "INOX", city: "Mumbai", occupancy: 76, revenue: "₹3,95,150" },
  { id: 3, name: "PVR", city: "Chennai", occupancy: 69, revenue: "₹3,20,780" },
  {
    id: 4,
    name: "INOX",
    city: "Bangalore",
    occupancy: 61,
    revenue: "₹2,75,430",
  },
  { id: 5, name: "PVR", city: "Delhi", occupancy: 54, revenue: "₹2,40,900" },
];

const TOP_MOVIES = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    bookings: "2,458 Bookings",
    revenue: "₹6,25,430",
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Mission: Impossible – Dead Reckoning",
    bookings: "1,865 Bookings",
    revenue: "₹4,35,250",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Garudan",
    bookings: "1,456 Bookings",
    revenue: "₹3,25,890",
    poster:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Furiosa: A Mad Max Saga",
    bookings: "1,125 Bookings",
    revenue: "₹2,85,630",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Jawan",
    bookings: "1,024 Bookings",
    revenue: "₹2,45,760",
    poster:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&auto=format&fit=crop",
  },
];

const TODAY_SUMMARY = [
  {
    key: "bookings",
    label: "Bookings",
    value: "1,256",
    delta: "15.3%",
    icon: "ticket",
    tone: "violet",
  },
  {
    key: "revenue",
    label: "Revenue",
    value: "₹3,25,450",
    delta: "18.7%",
    icon: "wallet",
    tone: "green",
  },
  {
    key: "users",
    label: "New Users",
    value: "342",
    delta: "12.1%",
    icon: "user",
    tone: "amber",
  },
  {
    key: "shows",
    label: "Shows",
    value: "32",
    delta: "6.3%",
    icon: "monitor",
    tone: "blue",
  },
  {
    key: "occupancy",
    label: "Occupancy",
    value: "72%",
    delta: "8.4%",
    icon: "chart",
    tone: "pink",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "BK10245",
    movie: "Kalki 2898 AD",
    show: "PVR Nexus, Hyd",
    seats: "A10, A11",
    amount: "₹480",
    status: "Confirmed",
  },
  {
    id: "BK10244",
    movie: "Mission: Impossible",
    show: "INOX, Mumbai",
    seats: "B5, B6, B7",
    amount: "₹1,050",
    status: "Confirmed",
  },
  {
    id: "BK10243",
    movie: "Garudan",
    show: "PVR, Chennai",
    seats: "C12, C13",
    amount: "₹560",
    status: "Confirmed",
  },
  {
    id: "BK10242",
    movie: "Furiosa",
    show: "INOX, Bangalore",
    seats: "D8, D9",
    amount: "₹460",
    status: "Pending",
  },
  {
    id: "BK10241",
    movie: "Jawan",
    show: "PVR, Delhi",
    seats: "E15, E16",
    amount: "₹520",
    status: "Confirmed",
  },
];

const OCCUPANCY_SEGMENTS = [
  { label: "0 - 25%", count: 12, color: "#17a673" },
  { label: "25 - 50%", count: 18, color: "#f0a83b" },
  { label: "50 - 75%", count: 24, color: "#f0c93b" },
  { label: "75 - 100%", count: 10, color: "#e05260" },
];

const UPCOMING_SHOWS = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    venue: "PVR Nexus, Hyderabad",
    time: "Today, 6:30 PM",
    filled: 45,
    poster: TOP_MOVIES[0].poster,
  },
  {
    id: 2,
    title: "Mission: Impossible",
    venue: "INOX, Mumbai",
    time: "Today, 7:15 PM",
    filled: 78,
    poster: TOP_MOVIES[1].poster,
  },
  {
    id: 3,
    title: "Garudan",
    venue: "PVR, Chennai",
    time: "Today, 9:30 PM",
    filled: 92,
    poster: TOP_MOVIES[2].poster,
  },
  {
    id: 4,
    title: "Furiosa",
    venue: "INOX, Bangalore",
    time: "Tomorrow, 5:45 PM",
    filled: 35,
    poster: TOP_MOVIES[3].poster,
  },
];

const NAV_SECTIONS = [
  {
    label: "Movie Management",
    items: [
      { key: "movies", label: "Movies", icon: "film" },
      { key: "shows", label: "Shows", icon: "clapper" },
      { key: "screens", label: "Screens", icon: "grid" },
      { key: "seats", label: "Seat Layouts", icon: "layout" },
      { key: "categories", label: "Categories", icon: "tag" },
      { key: "languages", label: "Languages", icon: "globe" },
    ],
  },
  {
    label: "Booking Management",
    items: [
      { key: "bookings", label: "Bookings", icon: "clipboard" },
      { key: "payments", label: "Payments", icon: "wallet" },
      { key: "refunds", label: "Refunds", icon: "refund" },
    ],
  },
  {
    label: "User Management",
    items: [
      { key: "users", label: "Users", icon: "user" },
      { key: "admins", label: "Admins", icon: "shield" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { key: "coupons", label: "Coupons", icon: "percent" },
      { key: "notifications", label: "Notifications", icon: "bell" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { key: "reports", label: "Reports", icon: "chart" },
      { key: "analytics", label: "Analytics", icon: "trend" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "settings", label: "Settings", icon: "settings" },
      { key: "audit", label: "Audit Logs", icon: "file" },
    ],
  },
];

function Icon({ name, size = 18 }) {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const p = {
    dashboard: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z" />,
    film: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="2" />
        <path d="M7 4v16M17 4v16M2.5 9h4.5M17 9h4.5M2.5 15h4.5M17 15h4.5" />
      </>
    ),
    clapper: (
      <>
        <path d="M3 9.5 5 4h3l-2 5.5M9 9.5 11 4h3l-2 5.5M15 9.5 17 4h3l-2 5.5" />
        <rect x="3" y="9.5" width="18" height="10.5" rx="1.5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
    layout: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
      </>
    ),
    tag: (
      <>
        <path d="M20.5 12.6 12 21.1 2.9 12 11.4 3.5H20a.5.5 0 0 1 .5.5v8.6Z" />
        <circle cx="16" cy="8" r="1.3" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8 11h8M8 15h5" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M16 12h3" />
      </>
    ),
    refund: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 3v5h5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    shield: (
      <path d="M12 2.5 20 6v6c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5V6Z" />
    ),
    percent: (
      <>
        <circle cx="7" cy="7" r="2.3" />
        <circle cx="17" cy="17" r="2.3" />
        <path d="M18 6 6 18" />
      </>
    ),
    bell: (
      <>
        <path d="M6 8a6 6 0 1 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M11 20V4M18 20v-7" />
        <path d="M2 20h20" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
      </>
    ),
    file: (
      <>
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    calendar: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    megaphone: (
      <>
        <path d="M3 11v2a2 2 0 0 0 2 2h1l1 5h2l-1-5h2l8 4V6l-8 4H6a2 2 0 0 0-2 2Z" />
        <path d="M19 8a4 4 0 0 1 0 8" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    "arrow-up": <path d="m18 15-6-6-6 6" />,
    ticket: (
      <>
        <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
        <path d="M10 6v2M10 11v2M10 16v2" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      </>
    ),
  };
  return <svg {...c}>{p[name]}</svg>;
}

export default function AdminDashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const occupancyTotal = OCCUPANCY_SEGMENTS.reduce(
    (sum, s) => sum + s.count,
    0,
  );

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;
  const donutSegments = OCCUPANCY_SEGMENTS.map((seg) => {
    const fraction = seg.count / occupancyTotal;
    const dash = fraction * circumference;
    const segment = { ...seg, dash, offset: offsetSoFar };
    offsetSoFar += dash;
    return segment;
  });

  return (
    <div className="AdminDashboard">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">
            <Icon name="film" size={20} />
          </span>
          <div>
            <p className="admin-brand-name">MovieHub</p>
            <p className="admin-brand-tag">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav">
          <a className="admin-link is-active" href="#">
            <Icon name="dashboard" size={18} />
            Dashboard
          </a>

          {NAV_SECTIONS.map((section) => (
            <div className="admin-group" key={section.label}>
              <p className="admin-group-label">{section.label}</p>
              {section.items.map((item) => (
                <a className="admin-link" href="#" key={item.key}>
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-account">
          <div className="admin-account-avatar">
            <Icon name="user" size={18} />
          </div>
          <div>
            <p className="admin-account-name">Admin User</p>
            <p className="admin-account-role">Super Admin</p>
          </div>
          <Icon name="chevron" size={16} />
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" aria-label="Toggle menu">
            <Icon name="menu" size={20} />
          </button>
          <div className="admin-heading">
            <h1>Dashboard</h1>
            <p>
              Welcome back, Admin! Here's what's happening with your cinema
              today.
            </p>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-daterange">
              <Icon name="calendar" size={16} />
              30 May – 5 Jun 2025
            </button>
            <button className="admin-bell" aria-label="Notifications">
              <Icon name="bell" size={19} />
              <span className="admin-badge">5</span>
            </button>
            <button className="admin-avatar-btn">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
                alt="Admin"
              />
              <span className="admin-status-dot" />
            </button>
          </div>
        </header>

        <div className="admin-content">
          {/* ---- STAT CARDS ---- */}
          <div className="stat-row">
            {STAT_CARDS.map((s) => (
              <div className="stat-card" key={s.key}>
                <span className={`stat-icon tone-${s.tone}`}>
                  <Icon name={s.icon} size={19} />
                </span>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value">{s.value}</p>
                <p className="stat-delta">
                  <Icon name="arrow-up" size={12} /> {s.delta}{" "}
                  <span>vs last week</span>
                </p>
              </div>
            ))}
          </div>

          {/* ---- THEATRE PERFORMANCE / TOP MOVIES / TODAY SUMMARY ---- */}
          <div className="row-3col">
            <section className="panel theatre-panel">
              <div className="panel-head">
                <div>
                  <h2>Theatre Performance</h2>
                  <p className="panel-subtitle">
                    Ranked by occupancy this week
                  </p>
                </div>
                <a className="panel-link" href="#">
                  View All
                </a>
              </div>

              <ul className="theatre-list">
                {THEATRE_PERFORMANCE.map((t, i) => (
                  <li key={t.id}>
                    <span className="theatre-rank">{i + 1}</span>
                    <div className="theatre-info">
                      <div className="theatre-info-top">
                        <p className="theatre-name">
                          <Icon name="building" size={14} /> {t.name}, {t.city}
                        </p>
                        <span className="theatre-revenue">{t.revenue}</span>
                      </div>
                      <div className="theatre-bar-track">
                        <div
                          className="theatre-bar-fill"
                          style={{ width: `${t.occupancy}%` }}
                        />
                      </div>
                    </div>
                    <span className="theatre-pct">{t.occupancy}%</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h2>Top Movies</h2>
                <a className="panel-link" href="#">
                  View All
                </a>
              </div>
              <ul className="movie-list">
                {TOP_MOVIES.map((m) => (
                  <li key={m.id}>
                    <img src={m.poster} alt={m.title} />
                    <div>
                      <p className="movie-title">{m.title}</p>
                      <p className="movie-sub">{m.bookings}</p>
                    </div>
                    <span className="movie-revenue">{m.revenue}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h2>Today's Summary</h2>
              </div>
              <ul className="summary-list">
                {TODAY_SUMMARY.map((s) => (
                  <li key={s.key}>
                    <span className={`stat-icon stat-icon-sm tone-${s.tone}`}>
                      <Icon name={s.icon} size={16} />
                    </span>
                    <div>
                      <p className="summary-label">{s.label}</p>
                      <p className="summary-value">{s.value}</p>
                    </div>
                    <span className="summary-delta">
                      <Icon name="arrow-up" size={11} /> {s.delta}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ---- BOOKINGS TABLE / OCCUPANCY / UPCOMING ---- */}
          <div className="row-3col row-3col-alt">
            <section className="panel">
              <div className="panel-head">
                <h2>Recent Bookings</h2>
                <a className="panel-link" href="#">
                  View All
                </a>
              </div>
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Movie</th>
                    <th>Show</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b) => (
                    <tr key={b.id}>
                      <td className="mono">{b.id}</td>
                      <td>{b.movie}</td>
                      <td>{b.show}</td>
                      <td>{b.seats}</td>
                      <td>{b.amount}</td>
                      <td>
                        <span
                          className={`status-badge status-${b.status.toLowerCase()}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="panel occupancy-panel">
              <div className="panel-head">
                <h2>Show Occupancy</h2>
                <a className="panel-link" href="#">
                  View All
                </a>
              </div>
              <div className="donut-wrap">
                <svg viewBox="0 0 160 160" className="donut-svg">
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.label}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="20"
                      strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                      strokeDashoffset={-seg.offset}
                      transform="rotate(-90 80 80)"
                    />
                  ))}
                </svg>
                <div className="donut-center">
                  <p className="donut-value">72%</p>
                  <p className="donut-label">Average Occupancy</p>
                </div>
              </div>
              <ul className="occupancy-legend">
                {OCCUPANCY_SEGMENTS.map((s) => (
                  <li key={s.label}>
                    <i className="dot" style={{ background: s.color }} />
                    {s.label}
                    <span>{s.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h2>Upcoming Shows</h2>
                <a className="panel-link" href="#">
                  View All
                </a>
              </div>
              <ul className="upcoming-list">
                {UPCOMING_SHOWS.map((s) => {
                  const tone =
                    s.filled >= 75 ? "red" : s.filled >= 50 ? "amber" : "green";
                  return (
                    <li key={s.id}>
                      <img src={s.poster} alt={s.title} />
                      <div>
                        <p className="upcoming-title">{s.title}</p>
                        <p className="upcoming-sub">{s.venue}</p>
                        <p className="upcoming-time">{s.time}</p>
                      </div>
                      <span className={`fill-badge fill-${tone}`}>
                        {s.filled}% Filled
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* ---- SYSTEM BANNER ---- */}
          {showBanner && (
            <div className="system-banner">
              <span className="system-banner-icon">
                <Icon name="megaphone" size={18} />
              </span>
              <div>
                <strong>System Update</strong>
                <p>
                  Upcoming maintenance on 10th June 2025 from 2:00 AM – 4:00 AM.
                  Some services may be unavailable.
                </p>
              </div>
              <button
                className="system-banner-close"
                onClick={() => setShowBanner(false)}
                aria-label="Dismiss"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
