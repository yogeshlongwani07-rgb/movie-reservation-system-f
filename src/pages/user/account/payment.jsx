import { useState } from "react";
import Icon from "../dashboard/components/icon";
import { PAYMENT_METHODS } from "../../../constants/user-contants";

export default function Payment({ booking, onPay, onBack }) {
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

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

  const fee = 30;
  const total = booking.amount + fee;

  function handlePay(e) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1400);
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
            A confirmation has been sent to your email.
          </p>
          <div className="ticket-mini">
            <p>
              {booking.theatre.name}, {booking.theatre.city}
            </p>
            <p>
              {booking.date} · {booking.time} · Seats {booking.seats.join(", ")}
            </p>
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={() => onPay({ ...booking, amount: total })}
          >
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
            <img src={booking.movie.poster} alt={booking.movie.title} />
            <div>
              <p className="summary-title">{booking.movie.title}</p>
              <p className="summary-sub">
                {booking.theatre.name}, {booking.theatre.city}
              </p>
              <p className="summary-sub">
                {booking.date} · {booking.time}
              </p>
            </div>
          </div>

          <div className="summary-row">
            <span>Seats</span>
            <span>{booking.seats.join(", ")}</span>
          </div>
          <div className="summary-row">
            <span>Ticket Price</span>
            <span>₹{booking.amount}</span>
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
    </section>
  );
}
