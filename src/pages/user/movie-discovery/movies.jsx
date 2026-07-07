import { useEffect, useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import { formatDuration, posterGradient } from "../../../utils/format";

export default function Movies({ movies = [], loading, onBook, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState("All");

  // Keep in sync when the navbar search sends a new query to this page.
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const languages = useMemo(() => {
    const set = new Set(movies.map((m) => m.language).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [movies]);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchesQuery = (m.title || "")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesLanguage = language === "All" || m.language === language;
      return matchesQuery && matchesLanguage;
    });
  }, [movies, query, language]);

  return (
    <section className="page movies-page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Browse Movies</h2>
          <p className="page-subtitle">
            {filtered.length} movie{filtered.length !== 1 ? "s" : ""} ready for
            you to book
          </p>
        </div>

        <div className="page-search">
          <Icon name="search" size={17} />
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {languages.length > 1 && (
        <div className="filter-chips">
          {languages.map((g) => (
            <button
              key={g}
              className={`filter-chip ${language === g ? "is-active" : ""}`}
              onClick={() => setLanguage(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="movie-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="movie-card skeleton-card" key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name="film" size={26} />
          <p>No movies match your search.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {filtered.map((movie) => {
            const bookableShows = (movie.shows || []).filter(
              (s) => s.availableSeats > 0,
            ).length;
            return (
              <article className="movie-card" key={movie._id}>
                <div
                  className="movie-poster"
                  style={{ background: posterGradient(movie.title) }}
                >
                  <span className="poster-glyph">
                    {movie.title?.[0] || "?"}
                  </span>
                  <span className="movie-rating">
                    <Icon name="star" size={11} /> {movie.rating ?? 0}
                  </span>
                  <span className="movie-lang-badge">{movie.language}</span>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title" title={movie.title}>
                    {movie.title}
                  </h3>
                  <p className="movie-desc">{movie.description}</p>
                  <div className="movie-meta">
                    <span>
                      <Icon name="clock" size={12} /> {formatDuration(movie.duration)}
                    </span>
                    <span className="poster-dot" />
                    <span className={bookableShows ? "is-open" : ""}>
                      {bookableShows} show{bookableShows !== 1 ? "s" : ""} open
                    </span>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    disabled={!(movie.shows || []).length}
                    onClick={() => onBook(movie)}
                  >
                    {(movie.shows || []).length
                      ? `Book · ₹${movie.price}`
                      : "No Shows Scheduled"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
