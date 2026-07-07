import { useEffect, useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import { PAYMENT_METHODS } from "../../../constants/user-contants";
import { bookSeats } from "../../../services/movieService";
import { formatDate, formatShowTime } from "../../../utils/format";

const CONVENIENCE_FEE = 30;

export default function Payment({ booking, onBooked, onBack }) {
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [remainingMs, setRemainingMs] = useState(
    booking ? booking.holdExpiresAt - Date.now() : 0,
  );

  useEffect(() => {
    if (!booking || success) return;
    const t = setInterval(() => {
      setRemainingMs(booking.holdExpiresAt - Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, [booking, success]);

  const expired = remainingMs <= 0;
  const countdown = useMemo(() => {
    const s = Math.max(0, Math.floor(remainingMs / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [remainingMs]);

  if (!booking) {
    return (
      <section className="page payment-page">
        <div className="empty-state">
          <Icon name="card" size={26} />
          <p>No booking in progress. Pick a movie and showtime first.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Browse Movies
          </button>
        </div>
      </section>
    );
  }

  const fee = CONVENIENCE_FEE;
  const total = booking.totalPrice + fee;

  async function handlePay(e) {
    e.preventDefault();
    if (expired) return;
    setProcessing(true);
    setError("");
    try {
      const res = await bookSeats(booking.movie._id, booking.show._id, booking.seats);
      setConfirmedBooking(res.booking);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Payment could not be confirmed. Your seat hold may have expired.",
      );
    } finally {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <section className="page payment-page">
        <div className="success-card">
          <div className="success-icon">
            <Icon name="check" size={30} />
          </div>
          <h2>Booking Confirmed!</h2>
          <p>
            Your tickets for <strong>{booking.movie.title}</strong> are booked.
          </p>
          <div className="ticket-mini">
            <p>
              Screen {booking.show.screen}
            </p>
            <p>
              {formatDate(booking.show.date)} · {formatShowTime(booking.show.showTime)} · Seats{" "}
              {(confirmedBooking?.seats || booking.bookingSeats)
                .map((s) => s.seatNumber)
                .join(", ")}
            </p>
          </div>
          <button className="btn btn-primary btn-block" onClick={onBooked}>
            View My Bookings
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page payment-page">
      <button className="back-link" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> Back to seat selection
      </button>

      {!expired && (
        <p className="page-subtitle">
          <Icon name="clock" size={13} /> Seats held for {countdown} — complete
          payment before the hold expires.
        </p>
      )}

      {expired && (
        <div className="empty-state">
          <Icon name="info" size={26} />
          <p>Your seat hold has expired. Please select seats again.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Seats
          </button>
        </div>
      )}

      {!expired && (
        <div className="payment-layout">
          <form className="payment-methods" onSubmit={handlePay}>
            <h3 className="section-label">
              <Icon name="wallet" size={16} /> Choose Payment Method
            </h3>

            <div className="method-list">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.key}
                  className={`method-card ${method === m.key ? "is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === m.key}
                    onChange={() => setMethod(m.key)}
                  />
                  <span className="method-icon">
                    <Icon name={m.icon} size={18} />
                  </span>
                  {m.label}
                </label>
              ))}
            </div>

            {method === "card" && (
              <div className="form-grid">
                <div className="form-group form-span-2">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />
                </div>
                <div className="form-group form-span-2">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="As on card"
                    required
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    required
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
            )}

            {method === "upi" && (
              <div className="form-grid">
                <div className="form-group form-span-2">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div className="form-grid">
                <div className="form-group form-span-2">
                  <label>Select Bank</label>
                  <select required defaultValue="">
                    <option value="" disabled>
                      Choose your bank
                    </option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              </div>
            )}

            {error && <p className="page-subtitle">{error}</p>}

            <p className="secure-note">
              <Icon name="shield" size={14} /> Payments are encrypted and secure.
            </p>

            <button className="btn btn-primary btn-block" disabled={processing}>
              {processing ? "Processing..." : `Pay ₹${total}`}
            </button>
          </form>

          <aside className="order-summary">
            <h3 className="section-label">Order Summary</h3>
            <div className="summary-movie">
              <div
                className="poster-tile"
                style={{
                  width: 56,
                  height: 78,
                  borderRadius: "var(--radius-sm)",
                  background: "linear-gradient(135deg, #6d28d9, #db2777)",
                }}
              >
                {booking.movie.title?.[0] || "?"}
              </div>
              <div>
                <p className="summary-title">{booking.movie.title}</p>
                <p className="summary-sub">Screen {booking.show.screen}</p>
                <p className="summary-sub">
                  {formatDate(booking.show.date)} · {formatShowTime(booking.show.showTime)}
                </p>
              </div>
            </div>

            <div className="summary-row">
              <span>Seats</span>
              <span>{booking.seats.slice().sort().join(", ")}</span>
            </div>
            <div className="summary-row">
              <span>Ticket Price</span>
              <span>₹{booking.totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Convenience Fee</span>
              <span>₹{fee}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
