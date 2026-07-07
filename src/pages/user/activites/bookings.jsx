import { useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import { formatDate, formatShowTime, posterGradient } from "../../../utils/format";

const TABS = ["Upcoming", "Completed", "Cancelled"];

function enrichBooking(raw, moviesMap) {
  const movie = moviesMap[raw.movie];
  const show = movie?.shows?.find((s) => s._id === raw.showId);

  let bucket = null;
  if (raw.status === "Cancelled") {
    bucket = "Cancelled";
  } else if (raw.status === "Confirmed") {
    if (show) {
      const showDateTime = new Date(`${show.date}T${show.showTime || "00:00"}`);
      bucket = showDateTime.getTime() < Date.now() ? "Completed" : "Upcoming";
    } else {
      bucket = "Upcoming";
    }
  }
  // "Hold" / "Expired" bookings are unfinished carts, not shown as tickets.

  return { raw, movie, show, bucket };
}

export default function Bookings({
  bookings = [],
  loading,
  moviesMap = {},
  onCancel,
  onBrowse,
}) {
  const [tab, setTab] = useState("Upcoming");
  const [cancellingId, setCancellingId] = useState(null);

  const enriched = useMemo(
    () => bookings.map((b) => enrichBooking(b, moviesMap)).filter((b) => b.bucket),
    [bookings, moviesMap],
  );

  const filtered = useMemo(
    () => enriched.filter((b) => b.bucket === tab),
    [enriched, tab],
  );

  async function handleCancel(bookingId) {
    setCancellingId(bookingId);
    try {
      await onCancel(bookingId);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="page bookings-page">
      <div className="page-head">
        <div>
          <h2 className="page-title">My Bookings</h2>
          <p className="page-subtitle">
            Track your upcoming shows and booking history
          </p>
        </div>
      </div>

      <div className="tab-row">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-chip ${tab === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
            <span className="tab-count">
              {enriched.filter((b) => b.bucket === t).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="ticket-list">
          {Array.from({ length: 2 }).map((_, i) => (
            <div className="ticket-card skeleton-card" key={i} style={{ height: 140 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name="clipboard" size={26} />
          <p>No {tab.toLowerCase()} bookings yet.</p>
          {tab === "Upcoming" && (
            <button className="btn btn-primary" onClick={onBrowse}>
              Book a Movie
            </button>
          )}
        </div>
      ) : (
        <div className="ticket-list">
          {filtered.map(({ raw, movie, show }) => (
            <article className="ticket-card" key={raw._id}>
              <div
                className="ticket-poster poster-tile"
                style={{ background: posterGradient(movie?.title || raw.movie) }}
              >
                {movie?.title?.[0] || "?"}
              </div>
              <div className="ticket-body">
                <div className="ticket-top">
                  <h3>{movie?.title || "Movie unavailable"}</h3>
                  <span className={`status-badge status-${tab.toLowerCase()}`}>
                    {tab}
                  </span>
                </div>
                {show && (
                  <p className="ticket-venue">
                    <Icon name="map-pin" size={13} /> Screen {show.screen}
                  </p>
                )}
                <div className="ticket-meta">
                  {show && (
                    <>
                      <span>
                        <Icon name="calendar" size={13} /> {formatDate(show.date)}
                      </span>
                      <span>
                        <Icon name="clock" size={13} /> {formatShowTime(show.showTime)}
                      </span>
                    </>
                  )}
                  <span>
                    <Icon name="seat" size={13} />{" "}
                    {raw.seats.map((s) => s.seatNumber).join(", ")}
                  </span>
                </div>
              </div>
              <div className="ticket-stub" aria-hidden="true">
                <span className="ticket-notch ticket-notch--top" />
                <span className="ticket-notch ticket-notch--bottom" />
              </div>
              <div className="ticket-side">
                <p className="ticket-id">#{raw._id.slice(-6).toUpperCase()}</p>
                <p className="ticket-amount">₹{raw.totalPrice}</p>
                {tab === "Upcoming" && (
                  <button
                    className="btn btn-ghost-outline"
                    disabled={cancellingId === raw._id}
                    onClick={() => handleCancel(raw._id)}
                  >
                    {cancellingId === raw._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
