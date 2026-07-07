function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatShowTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const GRADIENTS = [
  "linear-gradient(135deg, #6d28d9, #db2777)",
  "linear-gradient(135deg, #0891b2, #1d4ed8)",
  "linear-gradient(135deg, #ea580c, #be123c)",
  "linear-gradient(135deg, #059669, #0284c7)",
  "linear-gradient(135deg, #7c3aed, #4338ca)",
  "linear-gradient(135deg, #b45309, #831843)",
];

function posterGradient(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

const SEAT_TIER_MAP = {
  Standard: { cls: "classic", label: "Standard" },
  Premium: { cls: "premium", label: "Premium" },
  Recliners: { cls: "recliner", label: "Recliner" },
  Couple: { cls: "couple", label: "Couple" },
  Wheelchair: { cls: "wheelchair", label: "Wheelchair" },
};

function seatTier(seatType) {
  return SEAT_TIER_MAP[seatType] || { cls: "classic", label: seatType };
}

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function timeAgo(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

/**
 * Derives a lightweight notification feed from the user's bookings.
 * There is no notifications endpoint on the backend, so this is computed
 * client-side from data we already have (bookings + movie catalogue).
 */
function buildNotifications(bookings = [], moviesMap = {}) {
  const items = [];

  bookings.forEach((raw) => {
    const movie = moviesMap[raw.movie];
    const title = movie?.title || "Your movie";
    const show = movie?.shows?.find((s) => s._id === raw.showId);

    if (raw.status === "Confirmed") {
      items.push({
        id: `${raw._id}-confirmed`,
        icon: "ticket",
        text: `Booking confirmed for "${title}"`,
        time: raw.bookedAt,
      });

      if (show) {
        const showDateTime = new Date(`${show.date}T${show.showTime || "00:00"}`);
        const hoursToShow = (showDateTime.getTime() - Date.now()) / 3600000;
        if (hoursToShow > 0 && hoursToShow <= 48) {
          items.push({
            id: `${raw._id}-reminder`,
            icon: "clock",
            text: `"${title}" starts ${
              hoursToShow <= 24 ? "today/tomorrow" : "in 2 days"
            } — ${formatDate(show.date)}, ${formatShowTime(show.showTime)}`,
            time: raw.bookedAt,
            priority: true,
          });
        }
      }
    } else if (raw.status === "Cancelled") {
      items.push({
        id: `${raw._id}-cancelled`,
        icon: "close",
        text: `Booking for "${title}" was cancelled`,
        time: raw.cancelledAt || raw.bookedAt,
      });
    }
  });

  items.sort((a, b) => {
    if (!!b.priority !== !!a.priority) return b.priority ? 1 : -1;
    return new Date(b.time || 0) - new Date(a.time || 0);
  });

  return items.slice(0, 8);
}

export {
  formatDuration,
  formatDate,
  formatShowTime,
  posterGradient,
  seatTier,
  SEAT_TIER_MAP,
  todayStr,
  timeAgo,
  buildNotifications,
};
