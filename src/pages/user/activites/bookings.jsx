import { useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";

const TABS = ["Upcoming", "Completed", "Cancelled"];

export default function Bookings({ bookings = [], onCancel, onBrowse }) {
  const [tab, setTab] = useState("Upcoming");

  const filtered = useMemo(
    () => bookings.filter((b) => b.status === tab),
    [bookings, tab],
  );

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
              {bookings.filter((b) => b.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
          {filtered.map((b) => (
            <article className="ticket-card" key={b.id}>
              <div className="ticket-poster">
                <img src={b.poster} alt={b.movie} />
              </div>
              <div className="ticket-body">
                <div className="ticket-top">
                  <h3>{b.movie}</h3>
                  <span
                    className={`status-badge status-${b.status.toLowerCase()}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="ticket-venue">
                  <Icon name="map-pin" size={13} /> {b.theatre}
                </p>
                <div className="ticket-meta">
                  <span>
                    <Icon name="calendar" size={13} /> {b.date}
                  </span>
                  <span>
                    <Icon name="clock" size={13} /> {b.time}
                  </span>
                  <span>
                    <Icon name="seat" size={13} /> {b.seats.join(", ")}
                  </span>
                </div>
              </div>
              <div className="ticket-stub" aria-hidden="true">
                <span className="ticket-notch ticket-notch--top" />
                <span className="ticket-notch ticket-notch--bottom" />
              </div>
              <div className="ticket-side">
                <p className="ticket-id">#{b.id}</p>
                <p className="ticket-amount">₹{b.amount}</p>
                {b.status === "Upcoming" && (
                  <button
                    className="btn btn-ghost-outline"
                    onClick={() => onCancel(b.id)}
                  >
                    Cancel
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
