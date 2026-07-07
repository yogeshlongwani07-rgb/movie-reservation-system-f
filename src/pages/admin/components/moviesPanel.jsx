import { useEffect, useMemo, useState } from "react";
import Icon from "./icon";
import { formatDuration } from "../../../utils/format";

export default function MoviesPanel({
  movies = [],
  loading,
  onCreate,
  onEdit,
  onDelete,
  deletingId,
  initialQuery = "",
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) => (m.title || "").toLowerCase().includes(q));
  }, [movies, query]);

  return (
    <section className="panel admin-movies-panel">
      <div className="panel-head admin-movies-head">
        <div>
          <h2>Your Movies</h2>
          <p className="panel-subtitle">
            {movies.length} movie{movies.length !== 1 ? "s" : ""} listed under
            your account
          </p>
        </div>
        <div className="admin-movies-actions">
          <div className="admin-search">
            <Icon name="search" size={15} />
            <input
              type="text"
              placeholder="Search your movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="btn-solid" onClick={onCreate}>
            <Icon name="plus" size={15} /> Add Movie
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-movies-table-wrap">
          <div className="admin-movie-row skeleton-row" />
          <div className="admin-movie-row skeleton-row" />
          <div className="admin-movie-row skeleton-row" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">
            <Icon name="film" size={26} />
          </span>
          <h2>{movies.length === 0 ? "No movies yet" : "No matches"}</h2>
          <p>
            {movies.length === 0
              ? "Add your first movie to start selling tickets."
              : "Try a different search term."}
          </p>
          {movies.length === 0 && (
            <button className="btn-solid" onClick={onCreate}>
              <Icon name="plus" size={15} /> Add Movie
            </button>
          )}
        </div>
      ) : (
        <div className="admin-movies-table-wrap">
          <table className="admin-movies-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Shows</th>
                <th>Seats Filled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => {
                const shows = movie.shows || [];
                const totalSeats = shows.reduce((sum, s) => sum + (s.totalSeats || 0), 0);
                const occupied = shows.reduce((sum, s) => sum + (s.occupiedSeats || 0), 0);
                const pct = totalSeats ? Math.round((occupied / totalSeats) * 100) : 0;

                return (
                  <tr key={movie._id}>
                    <td>
                      <div className="admin-movie-title-cell">
                        <span
                          className="admin-movie-thumb"
                          style={{
                            background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                          }}
                        >
                          {movie.title?.[0] || "?"}
                        </span>
                        <div>
                          <p className="admin-movie-name">{movie.title}</p>
                          <p className="admin-movie-desc">{movie.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{movie.language}</td>
                    <td>{formatDuration(movie.duration)}</td>
                    <td>₹{movie.price}</td>
                    <td>{movie.rating ?? 0}/10</td>
                    <td>{shows.length}</td>
                    <td>
                      {totalSeats ? (
                        <span className="admin-fill-pill">{pct}%</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="icon-btn"
                          aria-label="Edit movie"
                          onClick={() => onEdit(movie)}
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          className="icon-btn icon-btn-danger"
                          aria-label="Delete movie"
                          disabled={deletingId === movie._id}
                          onClick={() => onDelete(movie)}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
