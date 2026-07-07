import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/adminDashboard.css";
import Icon from "./components/icon";
import ComingSoon from "./components/comingSoon";
import MoviesPanel from "./components/moviesPanel";
import MovieFormModal from "./components/movieFormModal";
import { useAuth } from "../../context/authContext";
import { getListedMovies } from "../../services/adminService";
import { createMovie, updateMovie, deleteMovie } from "../../services/movieService";
import { logout } from "../../services/authService";
import { formatDate, formatShowTime, timeAgo } from "../../utils/format";
import Loading from "../loading";

const NAV_SECTIONS = [
  {
    label: "Movie Management",
    items: [
      { key: "movies", label: "Movies", icon: "film" },
      { key: "screens", label: "Screens", icon: "grid" },
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
    items: [{ key: "coupons", label: "Coupons", icon: "percent" }],
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

const SECTION_LABELS = NAV_SECTIONS.flatMap((s) => s.items).reduce((map, item) => {
  map[item.key] = { label: item.label, icon: item.icon };
  return map;
}, {});

function buildAdminNotifications(movies = []) {
  const items = [];
  const now = Date.now();

  movies.forEach((movie) => {
    if (movie.createdAt) {
      const ageHrs = (now - new Date(movie.createdAt).getTime()) / 3600000;
      if (ageHrs <= 72) {
        items.push({
          id: `${movie._id}-added`,
          icon: "film",
          text: `"${movie.title}" was added to your listings`,
          time: movie.createdAt,
        });
      }
    }

    (movie.shows || []).forEach((show) => {
      if (show.totalSeats > 0 && show.availableSeats === 0) {
        items.push({
          id: `${movie._id}-${show._id}-soldout`,
          icon: "ticket",
          text: `"${movie.title}" is sold out for ${formatDate(show.date)}, ${formatShowTime(show.showTime)}`,
          time: movie.createdAt,
          priority: true,
        });
      }
    });
  });

  items.sort((a, b) => {
    if (!!b.priority !== !!a.priority) return b.priority ? 1 : -1;
    return new Date(b.time || 0) - new Date(a.time || 0);
  });

  return items.slice(0, 8);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activePage, setActivePage] = useState("dashboard");
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const [query, setQuery] = useState("");
  const [banner, setBanner] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMovies = useCallback(async () => {
    setMoviesLoading(true);
    try {
      const data = await getListedMovies();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setMoviesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const notifications = useMemo(() => buildAdminNotifications(movies), [movies]);
  const unseenCount = Math.max(notifications.length - seenCount, 0);

  const stats = useMemo(() => {
    const allShows = movies.flatMap((m) => m.shows || []);
    const totalSeats = allShows.reduce((sum, s) => sum + (s.totalSeats || 0), 0);
    const occupiedSeats = allShows.reduce((sum, s) => sum + (s.occupiedSeats || 0), 0);
    const occupancyPct = totalSeats ? Math.round((occupiedSeats / totalSeats) * 100) : 0;
    const estRevenue = movies.reduce((sum, m) => {
      const occ = (m.shows || []).reduce((s2, sh) => s2 + (sh.occupiedSeats || 0), 0);
      return sum + occ * (m.price || 0);
    }, 0);

    return {
      movies: movies.length,
      shows: allShows.length,
      totalSeats,
      occupiedSeats,
      occupancyPct,
      estRevenue,
    };
  }, [movies]);

  const occupancyBuckets = useMemo(() => {
    const buckets = [
      { label: "0 - 25%", count: 0, color: "#17a673" },
      { label: "25 - 50%", count: 0, color: "#f0c93b" },
      { label: "50 - 75%", count: 0, color: "#f0a83b" },
      { label: "75 - 100%", count: 0, color: "#e05260" },
    ];
    movies.forEach((m) => {
      (m.shows || []).forEach((s) => {
        if (!s.totalSeats) return;
        const pct = (s.occupiedSeats / s.totalSeats) * 100;
        if (pct < 25) buckets[0].count++;
        else if (pct < 50) buckets[1].count++;
        else if (pct < 75) buckets[2].count++;
        else buckets[3].count++;
      });
    });
    return buckets;
  }, [movies]);

  const bucketTotal = occupancyBuckets.reduce((s, b) => s + b.count, 0) || 1;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;
  const donutSegments = occupancyBuckets.map((seg) => {
    const fraction = seg.count / bucketTotal;
    const dash = fraction * circumference;
    const segment = { ...seg, dash, offset: offsetSoFar };
    offsetSoFar += dash;
    return segment;
  });

  const topMovies = useMemo(() => {
    return [...movies]
      .map((m) => {
        const occ = (m.shows || []).reduce((s, sh) => s + (sh.occupiedSeats || 0), 0);
        const total = (m.shows || []).reduce((s, sh) => s + (sh.totalSeats || 0), 0);
        return { movie: m, occupied: occ, pct: total ? Math.round((occ / total) * 100) : 0 };
      })
      .sort((a, b) => b.occupied - a.occupied)
      .slice(0, 5);
  }, [movies]);

  const upcomingShows = useMemo(() => {
    const now = Date.now();
    const list = [];
    movies.forEach((m) => {
      (m.shows || []).forEach((s) => {
        const dt = new Date(`${s.date}T${s.showTime || "00:00"}`).getTime();
        if (!Number.isNaN(dt) && dt >= now) {
          list.push({ movie: m, show: s, dt });
        }
      });
    });
    return list.sort((a, b) => a.dt - b.dt).slice(0, 5);
  }, [movies]);

  function toggleNotifications() {
    setNotifOpen((open) => {
      const next = !open;
      if (next) setSeenCount(notifications.length);
      return next;
    });
  }

  function openCreate() {
    setEditingMovie(null);
    setFormOpen(true);
  }

  function openEdit(movie) {
    setEditingMovie(movie);
    setFormOpen(true);
  }

  async function handleFormSubmit(payload) {
    setSaving(true);
    try {
      if (editingMovie) {
        await updateMovie(editingMovie._id, payload);
        setBanner({ type: "success", text: `"${payload.title}" updated.` });
      } else {
        await createMovie(payload);
        setBanner({ type: "success", text: `"${payload.title}" created.` });
      }
      setFormOpen(false);
      setEditingMovie(null);
      await fetchMovies();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(movie) {
    if (!window.confirm(`Delete "${movie.title}"? This can't be undone.`)) return;
    setDeletingId(movie._id);
    try {
      await deleteMovie(movie._id);
      setBanner({ type: "success", text: `"${movie.title}" deleted.` });
      await fetchMovies();
    } catch (err) {
      setBanner({
        type: "error",
        text: err.response?.data?.message || "Could not delete this movie.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    try {
      await logout("admin");
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/admin/login");
    }
  }

  function renderPage() {
    if (activePage === "movies") {
      return (
        <MoviesPanel
          movies={movies}
          loading={moviesLoading}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
          initialQuery={query}
        />
      );
    }

    if (activePage !== "dashboard") {
      const meta = SECTION_LABELS[activePage] || { label: "Coming Soon", icon: "settings" };
      return <ComingSoon label={meta.label} icon={meta.icon} />;
    }

    return (
      <>
        <div className="stat-row">
          <div className="stat-card">
            <span className="stat-icon tone-violet">
              <Icon name="film" size={19} />
            </span>
            <p className="stat-label">Total Movies</p>
            <p className="stat-value">{stats.movies}</p>
            <p className="stat-delta">
              <span>listed under your account</span>
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-icon tone-blue">
              <Icon name="monitor" size={19} />
            </span>
            <p className="stat-label">Total Shows</p>
            <p className="stat-value">{stats.shows}</p>
            <p className="stat-delta">
              <span>across all your movies</span>
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-icon tone-amber">
              <Icon name="grid" size={19} />
            </span>
            <p className="stat-label">Seats Filled</p>
            <p className="stat-value">{stats.occupancyPct}%</p>
            <p className="stat-delta">
              <span>
                {stats.occupiedSeats} of {stats.totalSeats} seats
              </span>
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-icon tone-green">
              <Icon name="wallet" size={19} />
            </span>
            <p className="stat-label">Estimated Revenue</p>
            <p className="stat-value">₹{stats.estRevenue.toLocaleString("en-IN")}</p>
            <p className="stat-delta">
              <span>from confirmed seats · rough estimate</span>
            </p>
          </div>
        </div>

        <div className="row-3col">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Top Movies</h2>
                <p className="panel-subtitle">Ranked by seats booked</p>
              </div>
            </div>
            {topMovies.length === 0 ? (
              <p className="admin-panel-empty">No shows yet — add a movie to see it here.</p>
            ) : (
              <ul className="movie-list">
                {topMovies.map(({ movie, occupied, pct }) => (
                  <li key={movie._id}>
                    <span
                      className="admin-movie-thumb admin-movie-thumb-sm"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                    >
                      {movie.title?.[0] || "?"}
                    </span>
                    <div>
                      <p className="movie-title">{movie.title}</p>
                      <p className="movie-sub">{occupied} seats booked</p>
                    </div>
                    <span className="movie-revenue">{pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel occupancy-panel">
            <div className="panel-head">
              <h2>Show Occupancy</h2>
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
                <p className="donut-value">{stats.occupancyPct}%</p>
                <p className="donut-label">Average Occupancy</p>
              </div>
            </div>
            <ul className="occupancy-legend">
              {occupancyBuckets.map((s) => (
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
            </div>
            {upcomingShows.length === 0 ? (
              <p className="admin-panel-empty">No upcoming shows scheduled.</p>
            ) : (
              <ul className="upcoming-list">
                {upcomingShows.map(({ movie, show }) => (
                  <li key={show._id}>
                    <span
                      className="admin-movie-thumb admin-movie-thumb-sm"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                    >
                      {movie.title?.[0] || "?"}
                    </span>
                    <div>
                      <p className="upcoming-title">{movie.title}</p>
                      <p className="upcoming-sub">Screen {show.screen}</p>
                      <p className="upcoming-time">
                        {formatDate(show.date)} · {formatShowTime(show.showTime)}
                      </p>
                    </div>
                    <span className="fill-badge fill-amber">
                      {show.totalSeats
                        ? Math.round((show.occupiedSeats / show.totalSeats) * 100)
                        : 0}
                      % Filled
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <MoviesPanel
          movies={movies}
          loading={moviesLoading}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
          initialQuery={query}
        />
      </>
    );
  }

  if (!user) {
    return <Loading />;
  }

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
          <button
            className={`admin-link ${activePage === "dashboard" ? "is-active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <Icon name="dashboard" size={18} />
            Dashboard
          </button>

          {NAV_SECTIONS.map((section) => (
            <div className="admin-group" key={section.label}>
              <p className="admin-group-label">{section.label}</p>
              {section.items.map((item) => (
                <button
                  className={`admin-link ${activePage === item.key ? "is-active" : ""}`}
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button className="admin-account admin-account-btn" onClick={handleLogout}>
          <div className="admin-account-avatar">
            <Icon name="user" size={18} />
          </div>
          <div>
            <p className="admin-account-name">{user?.name || "Admin"}</p>
            <p className="admin-account-role">Log out</p>
          </div>
          <Icon name="logout" size={16} />
        </button>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" aria-label="Toggle menu">
            <Icon name="menu" size={20} />
          </button>
          <div className="admin-heading">
            <h1>{activePage === "dashboard" ? "Dashboard" : SECTION_LABELS[activePage]?.label || "Dashboard"}</h1>
            <p>Welcome back, {user?.name?.split(" ")[0] || "Admin"}! Here's what's happening with your listings.</p>
          </div>

          <div className="admin-search admin-topbar-search">
            <Icon name="search" size={15} />
            <input
              type="text"
              placeholder="Search your movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActivePage("movies");
              }}
            />
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-notif-wrap" ref={notifRef}>
              <button className="admin-bell" aria-label="Notifications" onClick={toggleNotifications}>
                <Icon name="bell" size={19} />
                {unseenCount > 0 && (
                  <span className="admin-badge">{unseenCount > 9 ? "9+" : unseenCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="admin-notif-panel">
                  <div className="admin-notif-head">Notifications</div>
                  {notifications.length === 0 ? (
                    <div className="admin-notif-empty">
                      <Icon name="inbox" size={22} />
                      <p>Nothing to show right now.</p>
                    </div>
                  ) : (
                    <ul className="admin-notif-list">
                      {notifications.map((n) => (
                        <li key={n.id}>
                          <span className="admin-notif-icon">
                            <Icon name={n.icon} size={14} />
                          </span>
                          <span>
                            <span className="admin-notif-text">{n.text}</span>
                            <span className="admin-notif-time">{timeAgo(n.time)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
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
          {banner && (
            <div className={`admin-inline-banner admin-inline-banner-${banner.type}`}>
              <span>{banner.text}</span>
              <button onClick={() => setBanner(null)} aria-label="Dismiss">
                <Icon name="close" size={14} />
              </button>
            </div>
          )}

          {renderPage()}
        </div>
      </div>

      {formOpen && (
        <MovieFormModal
          movie={editingMovie}
          saving={saving}
          onClose={() => {
            setFormOpen(false);
            setEditingMovie(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
