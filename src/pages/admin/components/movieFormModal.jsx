import { useState } from "react";
import Icon from "./icon";

const emptyShow = () => ({
  key: Math.random().toString(36).slice(2),
  date: "",
  showTime: "",
  screen: "",
  rows: 10,
  columns: 12,
});

export default function MovieFormModal({ movie, onClose, onSubmit, saving }) {
  const isEdit = Boolean(movie);

  const [form, setForm] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    language: movie?.language || "Hindi",
    duration: movie?.duration || "",
    rating: movie?.rating ?? "",
    price: movie?.price || "",
  });

  const [shows, setShows] = useState(isEdit ? [] : [emptyShow()]);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateShow(key, field, value) {
    setShows((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)),
    );
  }

  function addShow() {
    setShows((prev) => [...prev, emptyShow()]);
  }

  function removeShow(key) {
    setShows((prev) => prev.filter((s) => s.key !== key));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.duration || !form.price) {
      setError("Please fill in title, description, duration and price.");
      return;
    }

    if (!isEdit) {
      if (shows.length === 0) {
        setError("Add at least one show — the backend requires it to create a movie.");
        return;
      }
      for (const s of shows) {
        if (!s.date || !s.showTime || !s.rows || !s.columns) {
          setError("Every show needs a date, a show time, rows and columns.");
          return;
        }
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      language: form.language.trim() || "Hindi",
      duration: Number(form.duration),
      price: Number(form.price),
      ...(form.rating !== "" ? { rating: Number(form.rating) } : {}),
    };

    if (!isEdit) {
      payload.shows = shows.map((s) => {
        const totalSeats = Number(s.rows) * Number(s.columns);
        return {
          date: s.date,
          showTime: s.showTime,
          screen: s.screen.trim() || "Screen 1",
          layout: { rows: Number(s.rows), columns: Number(s.columns) },
          totalSeats,
          availableSeats: totalSeats,
        };
      });
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong saving this movie. Please try again.",
      );
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <h2>{isEdit ? "Edit Movie" : "Add Movie"}</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-full">
              <span>Title</span>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Kalki 2898 AD"
              />
            </label>

            <label className="admin-field admin-field-full">
              <span>Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="A short synopsis..."
              />
            </label>

            <label className="admin-field">
              <span>Language</span>
              <input
                value={form.language}
                onChange={(e) => updateField("language", e.target.value)}
                placeholder="Hindi"
              />
            </label>

            <label className="admin-field">
              <span>Duration (minutes)</span>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="150"
              />
            </label>

            <label className="admin-field">
              <span>Price (₹)</span>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="250"
              />
            </label>

            <label className="admin-field">
              <span>Rating (0–10)</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
                placeholder="8.2"
              />
            </label>
          </div>

          {isEdit ? (
            <p className="admin-form-note">
              Showtimes are set when a movie is created and can't be edited
              here yet — the backend doesn't safely support updating an
              existing show's seat map. Delete and recreate the movie if the
              schedule needs to change.
            </p>
          ) : (
            <div className="admin-shows-builder">
              <div className="admin-shows-head">
                <span>Shows</span>
                <button type="button" className="btn-add-show" onClick={addShow}>
                  <Icon name="plus" size={14} /> Add show
                </button>
              </div>

              {shows.map((s, i) => (
                <div className="admin-show-row" key={s.key}>
                  <span className="admin-show-index">{i + 1}</span>
                  <input
                    type="date"
                    value={s.date}
                    onChange={(e) => updateShow(s.key, "date", e.target.value)}
                  />
                  <input
                    type="time"
                    value={s.showTime}
                    onChange={(e) => updateShow(s.key, "showTime", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Screen"
                    value={s.screen}
                    onChange={(e) => updateShow(s.key, "screen", e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Rows"
                    value={s.rows}
                    onChange={(e) => updateShow(s.key, "rows", e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Cols"
                    value={s.columns}
                    onChange={(e) => updateShow(s.key, "columns", e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-show-remove"
                    onClick={() => removeShow(s.key)}
                    aria-label="Remove show"
                    disabled={shows.length === 1}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-solid" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
