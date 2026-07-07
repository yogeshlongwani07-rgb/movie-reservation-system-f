import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./icon";
import { avatar } from "../../../../constants/user-contants";
import { buildNotifications, timeAgo } from "../../../../utils/format";

export default function Navbar({
  user,
  bookings = [],
  moviesMap = {},
  onSearch,
  onOpenProfile,
}) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const notifRef = useRef(null);

  const notifications = useMemo(
    () => buildNotifications(bookings, moviesMap),
    [bookings, moviesMap],
  );

  const unseenCount = Math.max(notifications.length - seenCount, 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleNotifications() {
    setNotifOpen((open) => {
      const next = !open;
      if (next) setSeenCount(notifications.length);
      return next;
    });
  }

  function submitSearch(e) {
    e.preventDefault();
    onSearch?.(query.trim());
  }

  return (
    <>
      <header className="navbar">
        <button className="navbar-menu" aria-label="Toggle menu">
          <Icon name="menu" size={20} />
        </button>

        <div className="navbar-greeting">
          <h1>Hello, {user?.name ? user.name.split(" ")[0] : "there"}!</h1>
          <p>Ready for your next movie?</p>
        </div>

        <form className="navbar-search" onSubmit={submitSearch}>
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <Icon name="search" size={18} />
          </button>
          <input
            type="text"
            placeholder="Search for movies, theatres or shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="navbar-search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                onSearch?.("");
              }}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </form>

        <div className="navbar-actions">
          <div className="navbar-notif" ref={notifRef}>
            <button
              className="navbar-bell"
              aria-label="Notifications"
              onClick={toggleNotifications}
            >
              <Icon name="bell" size={19} />
              {unseenCount > 0 && (
                <span className="navbar-badge">
                  {unseenCount > 9 ? "9+" : unseenCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="navbar-notif-panel">
                <div className="navbar-notif-head">
                  <span>Notifications</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="navbar-notif-empty">
                    <Icon name="bell" size={22} />
                    <p>You're all caught up.</p>
                  </div>
                ) : (
                  <ul className="navbar-notif-list">
                    {notifications.map((n) => (
                      <li key={n.id} className="navbar-notif-item">
                        <span className="navbar-notif-icon">
                          <Icon name={n.icon} size={15} />
                        </span>
                        <span className="navbar-notif-body">
                          <span className="navbar-notif-text">{n.text}</span>
                          <span className="navbar-notif-time">{timeAgo(n.time)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button className="navbar-avatar" onClick={onOpenProfile} type="button">
            <img src={avatar} alt={user?.name || "Profile"} />
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </header>
    </>
  );
}
