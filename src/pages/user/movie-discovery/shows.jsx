import { useEffect, useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import { getMovieShows, getShow, holdSeats } from "../../../services/movieService";
import {
  formatDate,
  formatDuration,
  formatShowTime,
  seatTier,
  todayStr,
} from "../../../utils/format";

const MAX_SEATS = 10;

export default function Shows({ movie, onConfirm, onBack }) {
  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(true);
  const [showsError, setShowsError] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);

  const [liveShow, setLiveShow] = useState(null);
  const [seatLoading, setSeatLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [holding, setHolding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movie?._id) return;
    let active = true;
    async function load() {
      setShowsLoading(true);
      setShowsError("");
      try {
        const data = await getMovieShows(movie._id);
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setShows(list);

        const today = todayStr();
        const dates = Array.from(new Set(list.map((s) => s.date))).sort();
        const defaultDate = dates.find((d) => d >= today) || dates[0] || null;
        setSelectedDate(defaultDate);
      } catch (err) {
        console.error(err);
        if (active) setShowsError("Could not load shows for this movie.");
      } finally {
        if (active) setShowsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [movie?._id]);

  const dates = useMemo(
    () => Array.from(new Set(shows.map((s) => s.date))).sort(),
    [shows],
  );

  const showsForDate = useMemo(
    () =>
      shows
        .filter((s) => s.date === selectedDate)
        .sort((a, b) => a.showTime.localeCompare(b.showTime)),
    [shows, selectedDate],
  );

  async function selectShow(showId) {
    setSelectedShowId(showId);
    setSelectedSeats([]);
    setError("");
    setSeatLoading(true);
    try {
      const show = await getShow(movie._id, showId);
      setLiveShow(show);
    } catch (err) {
      console.error(err);
      setError("Could not load the seat map for this show.");
    } finally {
      setSeatLoading(false);
    }
  }

  function backToShowList() {
    setSelectedShowId(null);
    setLiveShow(null);
    setSelectedSeats([]);
    setError("");
  }

  const seatRows = useMemo(() => {
    if (!liveShow) return [];
    const byRow = {};
    liveShow.seats.forEach((seat) => {
      if (!byRow[seat.row]) byRow[seat.row] = [];
      byRow[seat.row].push(seat);
    });
    return Object.keys(byRow)
      .sort()
      .map((row) => ({
        row,
        seats: byRow[row].sort((a, b) => a.column - b.column),
      }));
  }, [liveShow]);

  function toggleSeat(seat) {
    if (seat.status !== "Available") return;
    setSelectedSeats((prev) => {
      if (prev.includes(seat.seatNumber)) {
        return prev.filter((s) => s !== seat.seatNumber);
      }
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, seat.seatNumber];
    });
  }

  const seatByNumber = useMemo(() => {
    const map = {};
    (liveShow?.seats || []).forEach((s) => {
      map[s.seatNumber] = s;
    });
    return map;
  }, [liveShow]);

  const total = selectedSeats.reduce((sum, seatNumber) => {
    const seat = seatByNumber[seatNumber];
    if (!seat) return sum;
    return sum + movie.price * seat.priceMultiplier;
  }, 0);

  async function handleContinue() {
    if (selectedSeats.length === 0 || !liveShow) return;
    setHolding(true);
    setError("");
    try {
      const res = await holdSeats(movie._id, liveShow._id, selectedSeats);
      onConfirm({
        movie,
        show: liveShow,
        seats: selectedSeats,
        bookingSeats: res.seats.bookingSeats,
        totalPrice: res.seats.totalPrice,
        holdExpiresAt: Date.now() + 10 * 60 * 1000,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Some of those seats were just taken. Please pick again.",
      );
      // refresh the seat map so stale/unavailable seats show correctly
      try {
        const fresh = await getShow(movie._id, liveShow._id);
        setLiveShow(fresh);
        setSelectedSeats([]);
      } catch {
        /* ignore refresh failure, error above is enough */
      }
    } finally {
      setHolding(false);
    }
  }

  if (!movie) {
    return (
      <section className="page shows-page">
        <div className="empty-state">
          <Icon name="film" size={26} />
          <p>Pick a movie first to see its shows.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Browse Movies
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page shows-page">
      <button
        className="back-link"
        onClick={selectedShowId ? backToShowList : onBack}
      >
        <Icon name="arrow-left" size={16} />{" "}
        {selectedShowId ? "Back to showtimes" : "Back to movies"}
      </button>

      <div className="show-header">
        <div
          className="show-poster poster-tile"
          style={{ background: "linear-gradient(135deg, #6d28d9, #db2777)" }}
        >
          {movie.title?.[0] || "?"}
        </div>
        <div>
          <h2 className="page-title">{movie.title}</h2>
          <div className="poster-meta show-meta">
            <span className="poster-rating">
              <Icon name="star" size={13} /> {movie.rating ?? 0}/10
            </span>
            <span className="poster-dot" />
            <span>{movie.language}</span>
            <span className="poster-dot" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
        </div>
      </div>

      {showsLoading ? (
        <div className="empty-state">
          <p>Loading showtimes...</p>
        </div>
      ) : showsError ? (
        <div className="empty-state">
          <Icon name="info" size={26} />
          <p>{showsError}</p>
        </div>
      ) : shows.length === 0 ? (
        <div className="empty-state">
          <Icon name="calendar" size={26} />
          <p>No shows have been scheduled for this movie yet.</p>
        </div>
      ) : !selectedShowId ? (
        <>
          <div className="show-section">
            <h4 className="section-label">
              <Icon name="calendar" size={15} /> Select Date
            </h4>
            <div className="date-row">
              {dates.map((d) => (
                <button
                  key={d}
                  className={`date-chip ${selectedDate === d ? "is-active" : ""}`}
                  onClick={() => setSelectedDate(d)}
                >
                  <span>{formatDate(d)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="show-section">
            <h4 className="section-label">
              <Icon name="clock" size={15} /> Select Showtime
            </h4>
            {showsForDate.length === 0 ? (
              <p className="page-subtitle">No shows on this date.</p>
            ) : (
              <div className="time-row">
                {showsForDate.map((s) => (
                  <button
                    key={s._id}
                    className="time-chip"
                    disabled={s.availableSeats === 0}
                    onClick={() => selectShow(s._id)}
                  >
                    <Icon name="clock" size={13} /> {formatShowTime(s.showTime)}
                    {" · "}
                    {s.screen}
                    {" · "}
                    {s.availableSeats === 0
                      ? "Sold out"
                      : `${s.availableSeats} left`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="show-section">
            <h4 className="section-label">
              <Icon name="seat" size={15} /> Select Seats
            </h4>

            {error && <p className="page-subtitle">{error}</p>}

            {seatLoading || !liveShow ? (
              <p className="page-subtitle">Loading seat map...</p>
            ) : (
              <>
                <div className="seat-map">
                  <div className="screen-bar">Screen this way</div>
                  {seatRows.map((row) => (
                    <div className="seat-row" key={row.row}>
                      <span className="seat-row-label">{row.row}</span>
                      <div className="seat-row-seats">
                        {row.seats.map((seat) => {
                          const tier = seatTier(seat.seatType);
                          const taken = seat.status !== "Available";
                          return (
                            <button
                              key={seat._id}
                              disabled={taken}
                              title={`${seat.seatNumber} · ${tier.label}`}
                              className={`seat seat-${tier.cls} ${
                                taken ? "is-taken" : ""
                              } ${
                                selectedSeats.includes(seat.seatNumber)
                                  ? "is-selected"
                                  : ""
                              }`}
                              onClick={() => toggleSeat(seat)}
                              aria-label={seat.seatNumber}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="seat-legend">
                  <span>
                    <i className="dot dot-classic" /> Standard
                  </span>
                  <span>
                    <i className="dot dot-premium" /> Premium
                  </span>
                  <span>
                    <i className="dot dot-recliner" /> Recliner
                  </span>
                  <span>
                    <i className="dot dot-taken" /> Taken
                  </span>
                  <span>
                    <i className="dot dot-selected" /> Selected
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="booking-bar">
            <div>
              <p className="booking-bar-label">
                {selectedSeats.length
                  ? `${selectedSeats.length} seat${
                      selectedSeats.length > 1 ? "s" : ""
                    } · ${selectedSeats.slice().sort().join(", ")}`
                  : "Select seats to continue"}
              </p>
              <p className="booking-bar-amount">₹{total}</p>
            </div>
            <button
              className="btn btn-primary"
              disabled={selectedSeats.length === 0 || holding}
              onClick={handleContinue}
            >
              {holding ? "Holding seats..." : "Proceed to Payment"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
