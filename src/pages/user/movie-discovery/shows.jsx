import { useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import {
  THEATRES,
  SHOWTIMES,
  MOVIE_CATALOG,
} from "../../../constants/user-contants";

function buildDates() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      key: d.toISOString().slice(0, 10),
    });
  }
  return days;
}

function buildSeatMap() {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const takenPool = ["A4", "A5", "C7", "C8", "D2", "F10", "G3", "G4", "H6"];
  return rows.map((row, ri) => {
    const tier = ri < 2 ? "premium" : ri < 5 ? "classic" : "recliner";
    return {
      row,
      tier,
      seats: Array.from({ length: 12 }, (_, i) => {
        const id = `${row}${i + 1}`;
        return { id, taken: takenPool.includes(id) };
      }),
    };
  });
}

const TIER_PRICES = { classic: 180, premium: 240, recliner: 320 };

export default function Shows({ movie, onConfirm, onBack }) {
  const activeMovie = movie || MOVIE_CATALOG[0];
  const dates = useMemo(() => buildDates(), []);
  const seatMap = useMemo(() => buildSeatMap(), [activeMovie._id]);

  const [selectedDate, setSelectedDate] = useState(dates[0].key);
  const [selectedTheatre, setSelectedTheatre] = useState(THEATRES[0].id);
  const [selectedTime, setSelectedTime] = useState(SHOWTIMES[1]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  function toggleSeat(seat) {
    if (seat.taken) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((s) => s !== seat.id)
        : prev.length >= 8
          ? prev
          : [...prev, seat.id],
    );
  }

  function seatTier(seatId) {
    const row = seatMap.find((r) => seatId.startsWith(r.row));
    return row?.tier || "classic";
  }

  const total = selectedSeats.reduce(
    (sum, id) => sum + TIER_PRICES[seatTier(id)],
    0,
  );

  const theatre = THEATRES.find((t) => t.id === selectedTheatre);
  const dateInfo = dates.find((d) => d.key === selectedDate);

  function handleContinue() {
    if (selectedSeats.length === 0) return;
    onConfirm({
      movie: activeMovie,
      theatre,
      date: `${dateInfo.day} ${dateInfo.month}`,
      time: selectedTime,
      seats: selectedSeats.sort(),
      amount: total,
    });
  }

  return (
    <section className="page shows-page">
      <button className="back-link" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> Back to movies
      </button>

      <div className="show-header">
        <img
          className="show-poster"
          src={activeMovie.poster}
          alt={activeMovie.title}
        />
        <div>
          <h2 className="page-title">{activeMovie.title}</h2>
          <div className="poster-meta show-meta">
            <span className="poster-rating">
              <Icon name="star" size={13} /> {activeMovie.rating}/10
            </span>
            <span className="poster-dot" />
            <span>{activeMovie.language}</span>
            <span className="poster-dot" />
            <span>{activeMovie.duration}</span>
          </div>
          <div className="movie-tags">
            {(activeMovie.genre || []).map((g) => (
              <span className="movie-tag" key={g}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="show-section">
        <h4 className="section-label">
          <Icon name="calendar" size={15} /> Select Date
        </h4>
        <div className="date-row">
          {dates.map((d) => (
            <button
              key={d.key}
              className={`date-chip ${selectedDate === d.key ? "is-active" : ""}`}
              onClick={() => setSelectedDate(d.key)}
            >
              <span>{d.label}</span>
              <strong>{d.day}</strong>
              <span>{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="show-section">
        <h4 className="section-label">
          <Icon name="map-pin" size={15} /> Select Theatre
        </h4>
        <div className="theatre-row">
          {THEATRES.map((t) => (
            <button
              key={t.id}
              className={`theatre-card ${selectedTheatre === t.id ? "is-active" : ""}`}
              onClick={() => setSelectedTheatre(t.id)}
            >
              <p className="theatre-name">{t.name}</p>
              <p className="theatre-city">{t.city}</p>
            </button>
          ))}
        </div>

        <div className="time-row">
          {SHOWTIMES.map((time) => (
            <button
              key={time}
              className={`time-chip ${selectedTime === time ? "is-active" : ""}`}
              onClick={() => setSelectedTime(time)}
            >
              <Icon name="clock" size={13} /> {time}
            </button>
          ))}
        </div>
      </div>

      <div className="show-section">
        <h4 className="section-label">
          <Icon name="seat" size={15} /> Select Seats
        </h4>

        <div className="seat-map">
          <div className="screen-bar">Screen this way</div>
          {seatMap.map((row) => (
            <div className="seat-row" key={row.row}>
              <span className="seat-row-label">{row.row}</span>
              <div className="seat-row-seats">
                {row.seats.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.taken}
                    className={`seat seat-${row.tier} ${
                      seat.taken ? "is-taken" : ""
                    } ${selectedSeats.includes(seat.id) ? "is-selected" : ""}`}
                    onClick={() => toggleSeat(seat)}
                    aria-label={seat.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <span>
            <i className="dot dot-classic" /> Classic ₹{TIER_PRICES.classic}
          </span>
          <span>
            <i className="dot dot-premium" /> Premium ₹{TIER_PRICES.premium}
          </span>
          <span>
            <i className="dot dot-recliner" /> Recliner ₹{TIER_PRICES.recliner}
          </span>
          <span>
            <i className="dot dot-taken" /> Taken
          </span>
          <span>
            <i className="dot dot-selected" /> Selected
          </span>
        </div>
      </div>

      <div className="booking-bar">
        <div>
          <p className="booking-bar-label">
            {selectedSeats.length
              ? `${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} · ${selectedSeats.join(", ")}`
              : "Select seats to continue"}
          </p>
          <p className="booking-bar-amount">₹{total}</p>
        </div>
        <button
          className="btn btn-primary"
          disabled={selectedSeats.length === 0}
          onClick={handleContinue}
        >
          Proceed to Payment
        </button>
      </div>
    </section>
  );
}
