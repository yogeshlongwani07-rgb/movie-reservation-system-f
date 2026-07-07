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

export {
  formatDuration,
  formatDate,
  formatShowTime,
  posterGradient,
  seatTier,
  SEAT_TIER_MAP,
  todayStr,
};
