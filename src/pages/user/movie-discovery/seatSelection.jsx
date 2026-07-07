import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShowDetails,
  holdSeats,
  bookSeats,
} from "../../../services/movieService";
import { connectSocket, disconnectSocket } from "../../../services/socket";
import "../../../css/seatSelection.css";

const SEAT_STATUS = {
  AVAILABLE: "Available",
  LOCKED: "Locked",
  BOOKED: "Booked",
};

// "selecting" -> user is clicking seats
// "held"      -> hold API succeeded, 10 min countdown running, must confirm
// "booked"    -> booking API succeeded
const PHASE = { SELECTING: "selecting", HELD: "held", BOOKED: "booked" };

export default function SeatSelection() {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seatsMap, setSeatsMap] = useState({}); // seatNumber -> status
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [phase, setPhase] = useState(PHASE.SELECTING);
  const [connected, setConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const countdownRef = useRef(null);

  // ---- 1. Load the current seat layout over plain REST ----
  useEffect(() => {
    let isMounted = true;
    async function loadShow() {
      try {
        setLoading(true);
        const data = await getShowDetails(movieId, showId);
        if (!isMounted) return;
        const showData = data.show;
        setShow(showData);
        const map = {};
        showData.seats.forEach((seat) => {
          map[seat.seatNumber] = seat.status;
        });
        setSeatsMap(map);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Could not load this show.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadShow();
    return () => {
      isMounted = false;
    };
  }, [movieId, showId]);

  // ---- 2. Open the socket connection and join this show's room ----
  // This is the actual socket.io wiring: connect -> join-show -> listen for
  // seat:held / seat:booked broadcasts -> leave-show + disconnect on unmount.
  useEffect(() => {
    const socket = connectSocket();

    function handleConnect() {
      setConnected(true);
      // Matches backend/src/socket/seat.socket.js -> socket.on("seat:join-show", ...)
      socket.emit("seat:join-show", { movieId, showId });
    }

    function handleDisconnect() {
      setConnected(false);
      setJoinedRoom(false);
    }

    function handleJoinedShow(payload) {
      console.log("Joined seat room:", payload.room);
      setJoinedRoom(true);
    }

    function handleSeatError(payload) {
      setActionError(payload.message);
    }

    // Backend emits this from movie-controller.js#holdSeats via
    // emitToShow(movieId, showId, "seat:held", { seats }) after a
    // successful hold - by us or by any other client watching this show.
    function handleSeatHeld({ seats }) {
      setSeatsMap((prev) => {
        const next = { ...prev };
        seats.forEach((seat) => {
          next[seat.seatNumber] = SEAT_STATUS.LOCKED;
        });
        return next;
      });
    }

    // Backend emits this from movie-controller.js#bookSeat via
    // emitToShow(movieId, showId, "seat:booked", { seats }) once a booking
    // is confirmed - this is what makes the seat map update live for every
    // other viewer without them refreshing the page.
    function handleSeatBooked({ seats }) {
      setSeatsMap((prev) => {
        const next = { ...prev };
        seats.forEach((seat) => {
          next[seat.seatNumber] = SEAT_STATUS.BOOKED;
        });
        return next;
      });
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("seat:joined-show", handleJoinedShow);
    socket.on("seat:error", handleSeatError);
    socket.on("seat:held", handleSeatHeld);
    socket.on("seat:booked", handleSeatBooked);

    // If the socket is already connected by the time this effect re-runs
    // (e.g. movieId/showId changed) fire the join immediately.
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit("seat:leave-show", { movieId, showId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("seat:joined-show", handleJoinedShow);
      socket.off("seat:error", handleSeatError);
      socket.off("seat:held", handleSeatHeld);
      socket.off("seat:booked", handleSeatBooked);
      disconnectSocket();
    };
  }, [movieId, showId]);

  // ---- 3. Countdown for the 10 minute hold window (matches movie-domain.js) ----
  // holdSecondsLeft is seeded to 10 minutes at the moment handleHold() moves
  // us into PHASE.HELD (see below), so this effect only needs to start/stop
  // the ticking interval - it never sets state synchronously on mount.
  useEffect(() => {
    if (phase !== PHASE.HELD) {
      clearInterval(countdownRef.current);
      return;
    }
    countdownRef.current = setInterval(() => {
      setHoldSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(countdownRef.current);
          setPhase(PHASE.SELECTING);
          setActionError("Your hold expired. Please select seats again.");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [phase]);

  const rows = useMemo(() => {
    if (!show) return [];
    const byRow = {};
    show.seats.forEach((seat) => {
      if (!byRow[seat.row]) byRow[seat.row] = [];
      byRow[seat.row].push(seat);
    });
    return Object.entries(byRow).sort(([a], [b]) => a.localeCompare(b));
  }, [show]);

  const toggleSeat = useCallback(
    (seatNumber) => {
      if (phase !== PHASE.SELECTING) return;
      if (seatsMap[seatNumber] !== SEAT_STATUS.AVAILABLE) return;
      setActionError("");
      setSelectedSeats((prev) =>
        prev.includes(seatNumber)
          ? prev.filter((s) => s !== seatNumber)
          : [...prev, seatNumber],
      );
    },
    [phase, seatsMap],
  );

  async function handleHold() {
    if (selectedSeats.length === 0) return;
    try {
      setActionError("");
      await holdSeats(movieId, showId, selectedSeats);
      // Optimistically lock them locally too - the "seat:held" broadcast
      // we get back from our own emitToShow call will confirm this again,
      // it's just not guaranteed to arrive before the button re-renders.
      setSeatsMap((prev) => {
        const next = { ...prev };
        selectedSeats.forEach((seatNumber) => {
          next[seatNumber] = SEAT_STATUS.LOCKED;
        });
        return next;
      });
      setHoldSecondsLeft(10 * 60);
      setPhase(PHASE.HELD);
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not hold seats.");
    }
  }

  async function handleConfirmBooking() {
    try {
      setActionError("");
      await bookSeats(movieId, showId, selectedSeats);
      setPhase(PHASE.BOOKED);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Could not confirm booking.",
      );
    }
  }

  if (loading) return <div className="seat-page-status">Loading seats…</div>;
  if (error)
    return <div className="seat-page-status seat-page-error">{error}</div>;

  return (
    <div className="seat-page">
      <header className="seat-page-header">
        <button className="seat-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <h1>Select Your Seats</h1>
          <p>
            {show.date} · {show.showTime} · Screen {show.screen}
          </p>
        </div>
        <span
          className={`seat-connection-pill ${connected ? "is-live" : "is-offline"}`}
          title="Socket.IO connection status"
        >
          <span className="seat-connection-dot" />
          {connected && joinedRoom
            ? "Live updates on"
            : connected
              ? "Connecting to show…"
              : "Reconnecting…"}
        </span>
      </header>

      <div className="seat-screen-curve">Screen this way</div>

      <div className="seat-grid">
        {rows.map(([row, seats]) => (
          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            {seats
              .sort((a, b) => a.column - b.column)
              .map((seat) => {
                const status = seatsMap[seat.seatNumber];
                const isSelected = selectedSeats.includes(seat.seatNumber);
                return (
                  <button
                    key={seat.seatNumber}
                    className={[
                      "seat",
                      `seat-${seat.seatType.toLowerCase()}`,
                      status === SEAT_STATUS.BOOKED ? "seat-booked" : "",
                      status === SEAT_STATUS.LOCKED ? "seat-locked" : "",
                      isSelected ? "seat-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={
                      status !== SEAT_STATUS.AVAILABLE ||
                      phase !== PHASE.SELECTING
                    }
                    onClick={() => toggleSeat(seat.seatNumber)}
                    title={`${seat.seatNumber} · ${seat.seatType} · ${status}`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <span>
          <i className="seat-swatch seat-swatch-available" /> Available
        </span>
        <span>
          <i className="seat-swatch seat-swatch-selected" /> Selected
        </span>
        <span>
          <i className="seat-swatch seat-swatch-locked" /> Held by someone
        </span>
        <span>
          <i className="seat-swatch seat-swatch-booked" /> Booked
        </span>
      </div>

      {actionError && <div className="seat-action-error">{actionError}</div>}

      <footer className="seat-page-footer">
        {phase === PHASE.SELECTING && (
          <>
            <p>
              {selectedSeats.length} seat(s) selected:{" "}
              {selectedSeats.join(", ") || "none"}
            </p>
            <button
              className="seat-primary-btn"
              disabled={selectedSeats.length === 0}
              onClick={handleHold}
            >
              Hold Seats
            </button>
          </>
        )}

        {phase === PHASE.HELD && (
          <>
            <p>
              Seats held: {selectedSeats.join(", ")} · expires in{" "}
              {Math.floor(holdSecondsLeft / 60)}:
              {String(holdSecondsLeft % 60).padStart(2, "0")}
            </p>
            <button className="seat-primary-btn" onClick={handleConfirmBooking}>
              Confirm Booking
            </button>
          </>
        )}

        {phase === PHASE.BOOKED && (
          <p className="seat-booked-msg">
            🎉 Booking confirmed for seats {selectedSeats.join(", ")}!
          </p>
        )}
      </footer>
    </div>
  );
}
