import Icon from "./icon";
import { useState, useEffect, useMemo } from "react";

import { sample } from "../../../../constants/user-contants";
import { formatDuration } from "../../../../utils/format";

export default function Hero({ movies = [], loading, setActivePage }) {
  const slides = useMemo(() => movies.slice(0, 5), [movies]);
  const [activeSlide, setActiveSlide] = useState(0);
  const safeIndex = slides.length ? activeSlide % slides.length : 0;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(
      () => setActiveSlide((i) => (i + 1) % slides.length),
      4000,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="poster">
        <div className="poster-backdrop skeleton-card" />
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="poster">
        <div className="poster-scrim" />
        <div className="poster-content">
          <h2 className="poster-title">No movies listed yet</h2>
          <p>Check back soon, or ask an admin to add a movie.</p>
        </div>
      </section>
    );
  }

  const movie = slides[safeIndex];
  const backdrop = sample[safeIndex % sample.length];

  return (
    <>
      <section className="poster">
        <div
          className="poster-backdrop"
          style={{ backgroundImage: `url(${backdrop.url})` }}
        />
        <div className="poster-scrim" />

        <div className="poster-content">
          <span className="poster-eyebrow">{backdrop.tag}</span>
          <h2 className="poster-title">
            {movie.title}
            <br />
            {movie.description}
          </h2>
          <div className="poster-meta">
            <span className="poster-rating">
              <Icon name="star" size={14} /> {movie.rating ?? 0}/10
            </span>
            <span className="poster-dot" />
            <span>{movie.language}</span>
            <span className="poster-dot" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
          <div className="poster-actions">
            <button
              className="btn btn-primary"
              onClick={() => setActivePage("movies")}
            >
              Book Tickets
            </button>
            <button className="btn btn-ghost" type="button">
              <Icon name="play" size={16} /> Watch Trailer
            </button>
          </div>
        </div>

        <div className="poster-dots">
          {slides.map((m, i) => (
            <button
              key={m._id}
              className={`poster-dot-btn ${i === safeIndex ? "is-active" : ""}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Show ${m.title}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
