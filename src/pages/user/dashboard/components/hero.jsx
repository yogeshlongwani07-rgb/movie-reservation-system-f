import Icon from "./icon";
import { useState, useEffect } from "react";

import { sample } from "../../../../constants/user-contants";

export default function Hero({ movies, setActivePage }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActiveSlide((i) => (i + 1) % movies.length),
      4000,
    );
    return () => clearInterval(t);
  }, [movies.length]);

  const movie = movies[activeSlide];

  return (
    <>
      <section className="poster">
        <div
          className="poster-backdrop"
          style={{ backgroundImage: `url(${sample[activeSlide].url})` }}
        />
        <div className="poster-scrim" />

        <div className="poster-content">
          <span className="poster-eyebrow">{sample[activeSlide].tag}</span>
          <h2 className="poster-title">
            {movie.title}
            <br />
            {movie.description}
          </h2>
          <div className="poster-meta">
            <span className="poster-rating">
              <Icon name="star" size={14} /> {movie.rating}/10
            </span>
            <span className="poster-dot" />
            <span>{movie.language}</span>
            <span className="poster-dot" />
            <span>{movie.duration}</span>
          </div>
          <div className="poster-actions">
            <button
              className="btn btn-primary"
              onClick={() => setActivePage("movies")}
            >
              Book Tickets
            </button>
            <button className="btn btn-ghost">
              <Icon name="play" size={16} /> Watch Trailer
            </button>
          </div>
        </div>

        <div className="poster-dots">
          {movies.map((m, i) => (
            <button
              key={m._id}
              className={`poster-dot-btn ${i === activeSlide ? "is-active" : ""}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Show ${m.title}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
