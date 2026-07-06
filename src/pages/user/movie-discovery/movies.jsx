import { useEffect, useMemo, useState } from "react";
import Icon from "../dashboard/components/icon";
import getFewMovies from "../../../services/getFewMovies";
import { MOVIE_CATALOG, GENRES } from "../../../constants/user-contants";

export default function Movies({ onBook }) {
  const [movies, setMovies] = useState(MOVIE_CATALOG);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    let active = true;
    async function loadMovies() {
      try {
        const data = await getFewMovies();
        if (active && Array.isArray(data) && data.length) {
          const merged = data.map((m, i) => ({
            ...MOVIE_CATALOG[i % MOVIE_CATALOG.length],
            ...m,
          }));
          setMovies(merged);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMovies();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genre === "All" || (m.genre || []).includes(genre);
      return matchesQuery && matchesGenre;
    });
  }, [movies, query, genre]);

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

      <div className="filter-chips">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`filter-chip ${genre === g ? "is-active" : ""}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

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
          {filtered.map((movie) => (
            <article className="movie-card" key={movie._id}>
              <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} loading="lazy" />
                <span className="movie-rating">
                  <Icon name="star" size={12} /> {movie.rating}
                </span>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-desc">{movie.description}</p>
                <div className="movie-meta">
                  <span>{movie.language}</span>
                  <span className="poster-dot" />
                  <span>{movie.duration}</span>
                </div>
                <div className="movie-tags">
                  {(movie.genre || []).map((g) => (
                    <span className="movie-tag" key={g}>
                      {g}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => onBook(movie)}
                >
                  Book Tickets · ₹{movie.price ?? 199}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
