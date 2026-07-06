import Icon from "./icon";
import { useState, useEffect } from "react";

const backdrop = [
  {
    url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    tag: "NOW IN CINEMAS",
  },
  {
    url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",
    tag: "NEW RELEASE",
  },
];

export default function Hero({ movies }) {
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
          style={{ backgroundImage: `url(${backdrop[activeSlide].url})` }}
        />
        <div className="poster-scrim" />

        <div className="poster-content">
          <span className="poster-eyebrow">{backdrop[activeSlide].tag}</span>
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
            <button className="btn btn-primary">Book Tickets</button>
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
